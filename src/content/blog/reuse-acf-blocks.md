---
title: How to reuse ACF blocks on static templates
description: Learn how to reuse and share your ACF blocks with static templates
date: 2022-01-06
category: wordpress
---

If you want to share your ACF block templates so that they can be reused on static, ACF + classic editor templates, `get_template_parts()` and args are your friend.

You might have a similar theme structure to mine where each of your blocks are registered with a render template in something like `/template-parts/acf-blocks`.

```
./template-parts
│
└───/acf-blocks
│    │   block-a.php
│    │   block-b.php
│    │   block-c.php
```

Meanwhile, you're creating a static page template that just doesn't make sense to put into Gutenberg and you'd like to reuse the layout of one of those ACF blocks. Here's how you do that.

Say you have a typical hero block that takes a `heading`, `sub-heading`, and an `image`. We'll pull in the ACF block render template into our static page template with `get_template_parts()` and pass in our content as arguments.

```php
<?php
    get_template_part( 'template-parts/acf-blocks/block-a', null, array(
        'heading'       => 'This is some heading text',
        'sub_heading'   => 'This is some sub-heading text',
        'image'         =>  get_template_directory_URI() . '/images/my-image.jpg'
    ) );
?>
```

The content passed to the block is stored in key/value pairs in an array as the third parameter.

In your ACF block render template you parse those arguments and set defaults.

```php
<?php
    $args = wp_parse_args(
        $args,
        array(
        'heading' => get_field('heading'),
        'sub_heading' => get_field('sub_heading'),
        'image' => get_field('image')
        )
    );
?>
```

We're parsing the arguments passed to the block render template, but setting the default values as ACF fields since our Gutenberg blocks won't actually be calling `get_template_part()`.

In the block markup, we'll replace any instances of `get_field()`, `the_field()`, etc.

```php
<div class="hero">
	<h1><?= $args['heading']; ?></h1>
	<h2><?= $args['sub_heading']; ?></h2>
	<img src="<?= esc_url( $args['image'] ); ?>" />
</div>
```

And there you have it. Now your ACF block template can be used on classic editor pages or static templates.
