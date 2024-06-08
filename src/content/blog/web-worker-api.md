---
title: How to use web workers to serve an API
description: I moved a weighty JavaScript password strength library to a web worker. It made my app lighter, faster, and I learned working with web workers can be quite easy. 
date: 2022-04-24
category: javascript
---

I was researching JavaScript libraries to test a password's strength and I found a robust library called [Zxcvbn](https://github.com/dropbox/zxcvbn). The library allows you to pass in a string to the zxcvbn() function like: `let results = zxcvbn('Tr0ub4dour&3');` and it returns an object with the results of the test.

The test results consist of:

1. Estimated number of guesses it would take to crack your password
2. Time in seconds it would take to crack your password
3. A 4-point score where 0 is is weak and 4 is strong.
4. Feedback, warnings, and suggestions to make your password stronger
5. And more, just look into the library yourself if you're interested

I built a simple Alpine.js app that includes the Zxcvbn library. The template conditionally displays feedback, warnings, and suggestions based on the results from the test. You can test the Alpine.js app yourself below:

<div 
    class="bg-white border border-slate-400 rounded-lg text-black p-4 lg:px-20 lg:py-12 mx-auto my-12 lg:my-20 not-prose" id="app">
    <script src="https://cdn.jsdelivr.net/gh/joseph-farruggio/password-strength-widget@main-built/app.min.js"></script>
</div>

I've injected this widget as HTML from a CDN and not as an iFrame. If that interests you, check out my article on [Embedding JavaScript widgets as HTML](/javascript/embed-javascript-widget/)

## Moving Zxcvbn to a web worker
Zxcvbn is over a megabyte in file size. That's just way to large to ship to the client. I knew that moving this to a web worker would be best, but I hadn't really dug into them before. It only took 30 minutes of reading and I had setup a worker file with CloudFlare's Wrangler CLI. I ran into some Cors issues, but other than that it was straight forward.

The web worker is a single JS file and it's incredibly simple:

``` js
import zxcvbn from 'zxcvbn'

const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Origin': '*',
}


// Listen for incoming requests
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Create a function to take the request, pass it into the zxcvbn() function, and return the response object
const checkPassword = async request => {
  const { query } = await request.json();
  return new Response(JSON.stringify(zxcvbn(query)), {
    headers: {
      'Content-type': 'application/json',
      ...corsHeaders,
    },
  })
}

// Ensure that we only accept OPTIONS and POST requests
async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response('Ok', { headers: corsHeaders });
  }
  if (request.method === 'POST') {
    return checkPassword(request);
  }
}
```

In my Alpine.js app, there's a function that makes a POST request to my web worker:

``` js
async testPassword() {
    const response = await fetch(`https://password-tester.joeyfarruggio.workers.dev`, {
        method: 'POST',
        body: JSON.stringify({ 'query': this.password }),
        headers: {
            'Content-type': 'application/json'
        }
    });
    return response.json();
}
```

I'm able to populate the UI with the response object to display all of the test results listed above.