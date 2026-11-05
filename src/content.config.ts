import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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
    tips: z.array(z.string()).optional(),
  }),
});

const tips = defineCollection({
  loader: glob({
    base: './src/content/tips',
    pattern: '**/*.{md,mdx}',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/i, ''),
  }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    caseStudy: z.string().optional(),
  }),
});

const caseStudies = defineCollection({
  loader: glob({
    base: './src/content/case-studies',
    pattern: '**/*.{md,mdx}',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/i, ''),
  }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { sections, tips, caseStudies };