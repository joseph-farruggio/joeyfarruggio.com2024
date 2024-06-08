import { defineConfig } from 'astro/config';
import remarkHeadingID from 'remark-heading-id';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()]
});