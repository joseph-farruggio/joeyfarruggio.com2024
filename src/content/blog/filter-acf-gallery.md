---
title: How to create a filterable ACF Gallery
description: I recently built  filterable logo gallery for a Vimeo.com landing page. Here's how I did it.
date: 2022-05-05
category: wordpress
draft: true
---

## What we're building 
This is an ACF logo gallery on a Vimeo.com landing page I built recently. The Vimeo content team uploads images to the gallery and order them how they like.
!["ACF logo gallery"](../../images/blog/vimeo-logo-gallery.png "An ACF logo gallery")

Each filter (Industry, Region, Size) is a custom taxonomy assigned to the `attachment` post type. As you select options from the filters, you narrow down the list of logos. I'm not sure what to call it, but there's a dynamic sentence below the filters that let you know what you're looking at. Within the sentence you can dismiss the <span class="inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-white">
    little pills
    <button type="button" class="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-500 focus:outline-none focus:bg-slate-500 focus:text-white dark:bg-slate-600 dark:text-slate-300">
        <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8"><path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" /></svg>
    </button>
</span> to clear that filter out.
!["ACF logo gallery - filtered"](../../images/blog/vimeo-logo-gallery-filter.png "Filtering the ACF logo gallery")

## Taxonomies as filters 


For each filter you want to create (remember, each filter is representative of a taxonomy), you can use `get_terms()` to get all of the options.

My `Industry` filter looks like this (minus the Alpine JS for simplicity):

```php
<?php
    $terms = get_terms( 'industry', array(
        'hide_empty' => true, // hide unassigned terms
    ) ); 
?>

<button>Select Industry</button>
<ul>
    <?php foreach ($terms as $term) { ?>   
        <li><?= $term->name; ?></li>
    <?php endforeach; ?>
</ul>

```



