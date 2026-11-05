import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z, ZodType } from 'astro/zod';

const sections = defineCollection({
  loader: glob({
    base: './src/content/sections',
    pattern: '**/*.{md,mdx}',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/i, ''),
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    icon: image().optional(), // Validates and resolves the local image
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { sections };