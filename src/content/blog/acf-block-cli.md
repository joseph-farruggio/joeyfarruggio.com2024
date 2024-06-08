---
title: A CLI to create ACF blocks
description: The create-acf-block CLI registers your block within the acf_register_block_type() function, scaffolds a block render template, and optionally preps CSS and JS.
date: 2022-01-02
category: wordpress
---

## Why I built the create-acf-block CLI

Recently I was creating a number of ACF (Advanced Custom Field) blocks for a WordPress site and I was annoyed with the repetitive task of:

1. Registering the block in `acf_register_block_type()`
1. Creating a file to hold the render template
1. Copying and pasting in a starter template
1. Creating a CSS and JS file for the block

And you have to do that for each block - over and over again.

In the middle of that I stopped and ran a search for something like "ACF Block CLI" or "Create ACF Block CLI". I was surprised that there was nothing out there. Could I just build one myself? I've never built a CLI before and I didn't really know what was involved.

Conceptually, I knew what I wanted the CLI to do for me and I could picture how I would interact with it:

1. Provide the block's slug
1. Provide the block's name
1. And add a few optional preferences for `acf_register_block_type()`

Then the CLI would take care of those repetitive tasks I mentioned before.

## How I learned to build the create-acf-block CLI

Since I've not built a CLI before I knew I'd need to start reading or take a course or something. That's when I remembered that [Ahmad Awais](https://twitter.com/MrAhmadAwais) had a [Node CLI course](https://nodecli.com/). I didn't even have to take the entire course to start working on my CLI. In fact, I had enough knowledge to get started after just 30 minutes of his lessons.

I'll definitely continue with the rest of the course. Ahmad is very enjoyable to learn from and I'm sure I'll be able to refactor and improve my CLI with what I'll learn in the future.

## How to use the create-acf-block CLI

When you first run the CLI within your project, you'll be prompted to specify some project preferences:

1. The path to your block registration file. This could be your functions.php file or something like `/inc/acf-blocks.php`.
1. The path to your block render templates. This is where the CLI will create your block template files.
1. Whether to create block assets - CSS and JS.
1. Whether to group your block assets. Should your CSS and JS live in a separate folder or group block templates with their assets?

Then, you'll quickly move through the block details:

1. Block Name (slug)
1. Block Title
1. Description
1. Use innerBlocks? This preps the render template for JSX
1. Category
1. Mode
1. Align

These are options that get passed to the `acf_register_block_type()` function. Only _Block Name_ and _Block Title_ are required.

## How the create-acf-block CLI works

It's pretty simple actually. Here's an overview of the CLI:

1. preferences()  
   Check if the preferences are not set or if the `--preferences` flag is present. If ether are true, present the user with the preferences prompts.

2. CheckRegistrationFile()  
   Check to make sure that the user supplied path to their block registration file exists.

3. checkCommentMarkers()  
   Then we check inside that registration file to ensure that there are "comment markers". There's an opening and closing comment to tell the CLI where to insert new blocks within the file.

4. prompts()  
   Present the general block details prompts and pass those responses to the following three functions.

5. registerBlocks()  
   Open the registration file, find the comment markers, and insert the populated `acf_register_block_type()` function.

6. createRenderTemplate()  
   Create thee block render template. If the "Group block assets" preference is true, the folder structure will look something like:

```
./blocks
│
└───hero
│    │   block.php
│    │   block.css
│    │   block.php
└───quote
      │   block.php
      │   block.css
      │   block.php
```

Otherwise, assets will be grouped by file type:

```
./blocks
│   hero.php
│   quote.php
│
./css
│   hero.css
│   quote.css
./js
│   hero.js
│   quote.js
```

7. createAssets()  
   Optionally create the block CSS and JS and place them in the appropriate folder.

And that's it! I was pretty pleased with how easily this all came together. And it took me less than a days worth of work to figure it out and build it. The best part is that I'm totally using this on three or four projects already. It's very helpful!

If you want you checkout the code you can find it at https://github.com/joseph-farruggio/create-acf-block.
