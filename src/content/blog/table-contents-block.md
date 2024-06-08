---
title: A table of contents Gutenberg block
description: Insert a table of contents anywhere in your post with this Gutenberg block.
date: 2022-01-03
category: wordpress
---

I end up building a table of contents feature for most WordPress sites that I work on. They include the following features:

1. Insert the TOC as either a block in the sidebar area
1. Insert the TOC as a block anywhere in the post content
1. Automatically generate a TOC based on headings in the post
1. Automatically assign IDs to headings on the frontend
1. Limit the TOC by heading level
1. Ignore headings with an `.ignore` class name on headings
1. Override the TOC and provide a custom list while maintaining the same markup and styles

## Get the blocks from post_content

Getting the headings from a post in Gutenberg is easy with the `parse_blocks()` function.

```php
if ( has_blocks( $post->post_content ) ) {

   // Get the post content
   $blocks = parse_blocks( $post->post_content );

   // continued...
}
```

## Loop through the blocks

We can loop through the blocks and target just the heading blocks by `blockName`.

```php
$i = 0;

// Loop through each block
foreach( $blocks as $block ) {

    // Target just headings by blockName
    if ( $blocks[$i]['blockName'] === 'core/heading' ) {

        // continued...
    }
    $i++;
}
```

## Heading Levels via Attributes

Headings have a `level` attribute. We can use this to target headings by level. For some reason, H2 headings do not have a 'level' attribute, so I assign one.

```php

// Assign a level attr for H2s
if ( !isset($blocks[$i]['attrs']['level']) ) {
    $blocks[$i]['attrs']['level'] = 2;
}
```

## Display headings if it passes the tests

Now that we have all of the heading blocks we check if the heading level is in our heading list (an array from an ACF field in the block) and ensure it doesn't have the `.ignore` class name.

```php
// Store the heading level for the current block in the loop in a variable
$headingLevel = 'h'.$blocks[$i]['attrs']['level'];

// Include the heading if it is in the headings list and is not ignored
if ( in_array($headingLevel,  get_field('headings')) && strpos($blocks[$i]['attrs']['className'], 'ignore') === false ) {

    // The heading markup is stored in 'innerHTML'
    $fullstring = $blocks[$i]['innerHTML'];

    // We don't want to display the heading HTML, just the string of text, so we remove the tags
    $parsed = get_string_between($fullstring, '>', '</h');

    /**
    * Echo the TOC item
    * toSafeID() takes the heading ID and removes spaces and special characters
    */
    echo "<li><a href='#" . toSafeID($parsed) . "'>" . $parsed . "</a></li>";
}
```

Interested in seeing all of the code together? Check out the repo here: https://github.com/joseph-farruggio/Slick-Table-of-Contents
