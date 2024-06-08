---
title: Embed JavaScript Widgets as HTML
description: Embed widgets as HTML, not an iframe, with JavaScript
date: 2022-02-12
category: javascript
---

## What we're building 

When you're building JavaScript widgets with the intention of making them sharable so they can be embedded on any website, there's a way to improve the performance and mobile responsiveness of the widget by injecting the widget as HTML and not embedding it as an iFrame.

What we're going to do is setup a local dev environment and build a simple widget. We'll setup a build process that will create a single JavaScript file that we can distribute over a CDN. By including that JavaScript file on another website we can inject our widget as actual HTML and avoid iFrames.

Most of my widget projects are built with Tailwind CSS for styling and Alpine.js for data binding and reactivity, but feel free to use what you're comfortable with.

## Local dev setup 

Here are some of the NPM packages I'm using and what they're for:

[Laravel Mix](#https://laravel-mix.com/)  
An elegant wrapper for Webpack that makes building assets like CSS and JS dead simple.

[HTML-Loader](https://webpack.js.org/loaders/html-loader/)  
This Webpack package exports HTML as a string. It will allow us to import HTML templates into our JavaScript.

[Tailwind CSS](#https://tailwindcss.com/)  
A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.

[Larevel-Mix-Tailwind](https://github.com/JeffreyWay/laravel-mix-tailwind)  
An extension to help Laravel Mix process your Tailwind stylesheet.

[Alpine.js](https://alpinejs.dev/)  
Your new, lightweight, JavaScript framework. Heavily inspired by Vue.js, but much much simpler.

## Create an Alpine widget 

Let's start our project by creating a simple HTML template. In a new project folder create an html file - I'll name mine `widget.html`. 

I'm going to create a simple Alpine component with a button that will toggle the visibility of content:

``` html
<div x-data="{open: false}">
    <button @click="open = !open">Toggle</button>
    <p x-show="open">Now you see me</p>
</div>
```

## Prepare our JavaScript 

I'm going to store all of my JS files in a `/src` directory and I'll start with creating an `app.js` and an `initAlpine.js`.

In `initAlpine.js` I'll import the Alpine NPM package and I'll import my `widget.html` template:


``` js
// initAlpine.js
// Import the Alpine JS framework
import Alpine from 'alpinejs'

// If you abstracted your Alpine component logic, you'd import that here
import widget from './widget.js'

// import widget template
import widgetHTML from './../widget.html';
```

Next we're going to initialize Alpine and target a div to inject our widget:

``` js
// initAlpine.js continued
const initAlpine = () => {
  
    /**
     *  If you're abstracting your component logic into a JS file (imported above), 
     * you would register your component with Alpine like this:
     *  Alpine.data('widget', widget); 
     */

    window.Alpine = Alpine
    Alpine.start();

    // #app is a div that we're going to inject our markup into
    document.getElementById("app").innerHTML = widgetHTML;
}

export default initAlpine;
```

In `app.js` we'll import our `initAlpine.js` file:

``` js
// app.js
import initAlpine from './initAlpine';
initAlpine();
```

## Setup HTML Loader and Laravel Mix 

Here's the basic setup for Laravel Mix. With this you can run `npx mix` and it will process our Alpine JS and import our widget template file. We'll have a `/dist/app.js` file that we can include on any webpage that will inject our little Alpine widget into a `<div id="app"></div>`.

``` js
// Require Laravel Mix
let mix = require('laravel-mix');

// Process our app.js file and output it to /dist/app.js
mix.js('src/app.js', 'dist/app.js').setPublicPath('dist');

// Setup HTML-Loader to allow us to import HTML templates
mix.webpackConfig({
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  }
});
```

## Distributing our JavaScript Widget 

At this point we have a production ready script to share, but how do we go about sharing it? The easiest and quickest thing you can do is push your project up to Github and allow a CDN like  [jsdeliver.com](https://www.jsdelivr.com) to cache and serve your JavaScript for you. Another similar option is [raw.githack.com](http://raw.githack.com/).

The way this works is you include your production JS in your repo. You can't load JavaScript files directly from GitHub, but you can pass that JS off to JSDeliver.com and they'll cache it and serve it for you. For JSDeliver.com it looks like this:

https://cdn.jsdelivr.net/gh/`user`/`repo`@`version`/`file`

My GitHub username is `joseph-farruggio` and say my repo name is `js-widget` which is at version `1.0`.

I'd access my JS from the CDN by linking to: https://cdn.jsdelivr.net/gh/joseph-farruggio/js-widget@1.0/dist/app.js.

JSDeliver has some other neat features too:

1. For testing, you can omit the version completely to get the latest one - not for production use.
1. Add ".min" to any JS/CSS file to get a minified version if it doesn't already exist.

## Including CSS with our widget 

We'll want to include a CSS file to style our widget. Instead of requiring people who want to embed our widget to include a JS and a CSS file, we can create the `<link rel="stylesheet">` our selves and download the CSS we need. Here's what that looks like:

In our /src folder I'll create a new JS file called `injectCSS.js`.

``` js
const injectCSS = () => {
  // Create a <link> element
  var link = document.createElement("link");

  // Set the link type to and rel attributes
  link.type = "text/css";
  link.rel = "stylesheet";
  
  if (process.env.NODE_ENV  == 'production') {
    // A CDN link to your production CSS
    link.href = "https://cdn.jsdelivr.net/gh/joseph-farruggio/js-widget@1.0/dist/styles.css";
  } else {
    // Your local CSS for local development
    link.href = "./../dist/styles.css";
  }

  // Append the stylesheet to the <head> of the DOM
  var head = document.head;
  head.appendChild(link);
}

export default injectCSS;
```

You'll need to import the `injectCSS.js` file in `app.js`, just like we imported Alpine and out HTML template. You'll also need to process your stylesheet and include it in your build process.



## GitHub Actions 

If you'd prefer not to build and version control production/built assets locally, you can run a GitHub action which will run Laravel Mix to build your JavaScript and then copy it to a `built` branch. This is what I do personally. I'll have a `master` branch that contains my latest source files and a `master-built` branch that only contains the production assets. It's literally just a JS and a CSS file.

Here's what that Github Action looks like:

``` yaml
name: Build and copy production assets to a built branch

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2-beta
        with:
          node-version: "12"
          check-latest: true
      - name: Install NPM dependencies & Compile assets for production
        run: |
          npm install
          npm run build

      - name: List output files
        run: ls

      - name: Push
        uses: s0/git-publish-subdir-action@develop
        env:
          REPO: self
          BRANCH: master-built # The branch name where you want to push the assets
          FOLDER: dist # The directory where your assets are generated
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # GitHub will automatically add this - you don't need to bother getting a token
          MESSAGE: "Build: ({sha}) {msg}" # The commit message
```

Any time there is a push or a pull request to master, the project builds and the production assets get copied to the `master-built` branch.

## Live demo 

Below is a simple weather widget that I built with Alpine. It takes in a zip code, converts it to lat/lon coordinates and requests the current weather using the openweathermap.org API. I used the exact steps above, so that means I included JS that's injecting the weather widget markup into the `<div id="app"></div>` that I included right after this paragraph. Give it a try!

<div id="app"></div> 
<script defer src="https://cdn.jsdelivr.net/gh/joseph-farruggio/Ineject-HTML-Components-with-Script@master-built/app.js"></script>


## Potential Issues 

**Conflicting CSS**  
Since this method injects HTML markup, it's possible to get styling conflicts. Any CSS loaded on the same page can accidentally affect your widget. In my Tailwind config I set `important: true;` so that all of my Tailwind classes apply the `!important` flag making style conflicts less likely. But it can still happen.

**Conflicting IDs**  
I'd recommend creating a unique ID instead of using `<div id="app"></div>`. Maybe name it after your widget or something like `<div id="weather-widget"></div>`. The chances of someone having a ID conflict with #app is significant, but much less so with #weather-widget. You could obviously go a step further and generate a random string for the ID, but I'll leave that up to you.

**Conflicting Alpine Instances**  
If your Alpine widget gets injected onto a page that's already running its own instance of Alpine, you're likely going to get errors. The primary reason being, if your widget or the host website has Alpine components extracted with `Alpine.data`, the dedicated component won't exist in the other Alpine instance. I think there are two steps to prevent this issue:

1. **Inline your Alpine component logic in `x-data`.**  
This will prevent the host website's Alpine instance from complaining about not being able to find your component.

2. **Check if Alpine is attached to the window before you `start()` your own instance of Alpine.**  
This will prevent your Alpine instance from complaining about not being able to find the host website's components.

``` js
// Give the host website's Alpine instance a chance to mount
document.addEventListener("DOMContentLoaded", function () {
		// If Alpine doesn't exist, start it up/
    if (!window.Alpine) {
			window.Alpine = Alpine;
			Alpine.start();
		}
	});
```

I don't think this is 100% fool proof. So if you have ideas, questions, concerns, please let me know in the comments!