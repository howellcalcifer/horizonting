import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    icon: image().optional(), // Validates and resolves the local image
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    layout: z.string(),
  }),
});

export const collections = { articles };