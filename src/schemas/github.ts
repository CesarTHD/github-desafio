import { z } from "zod";

export const GitHubUserSchema = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string(),
  html_url: z.string().url(),
  name: z.string().nullable(),
  company: z.string().nullable(),
  blog: z.string().nullable(),
  location: z.string().nullable(),
  email: z.string().nullable(),
  bio: z.string().nullable(),
  twitter_username: z.string().nullable(),
  public_repos: z.number(),
  followers: z.number(),
  following: z.number(),
  created_at: z.string(),
});

export type GitHubUser = z.infer<typeof GitHubUserSchema>;

export const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  fork: z.boolean(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  updated_at: z.string(),
  created_at: z.string(),
  pushed_at: z.string(),
});

export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

export const RepoSortOptions = ["created", "updated", "pushed", "full_name"] as const;
export type RepoSort = (typeof RepoSortOptions)[number];

export const SortDirectionOptions = ["asc", "desc"] as const;
export type SortDirection = (typeof SortDirectionOptions)[number];
