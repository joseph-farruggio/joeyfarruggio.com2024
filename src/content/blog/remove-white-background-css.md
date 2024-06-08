---
title: Remove white background from image – CSS solution
description: There's a clever, CSS only trick to remove the background color from your images. Let's learn how...
date: 2020-06-04
category: wordpress
---

So I’m building a premium WP theme tailored for Affiliates and product review websites – and I’m hoping to release it later this year. I was just working on a product review demo page where I’ve uploaded an image of a MacBook Pro and I wanted to change the background color for the header of this product card. 

![Remove background color from image!](../../images/blog/remove-bg-color.jpg "Remove background color from image!")

And I noticed how the image’s white background doesn’t look too great over the gray background.

Instead of bringing this image into photoshop, removing the background, and rey-loading it to the WordPress – what if I could take care of this right here in the Gutenerg editor?

Well, we can… and with just a click of a button.

![Remove background color from image!](../../images/blog/bg-color-toggle.jpg "Remove background color from image!")

The screenshot above shows an ACF field that adds one line of CSS to the image.
This is a pure CSS solution and it works in most modern browsers.

``` css
mix-blend-mode: multiply;
```

mix-blend-mode: multiply;
This feature works best when the background color is light shade… and fails completely if you go too dark. 

Once you get your hands on this theme you can easily test it and see how it works in your own use case.

![Remove background color from image!](../../images/blog/remove-background-examples.jpg "Remove background color from image!")

