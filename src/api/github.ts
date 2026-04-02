import { GitHubUserSchema, GitHubRepoSchema, type GitHubUser, type GitHubRepo, type RepoSort, type SortDirection } from "@/schemas/github";

const BASE_URL = "https://api.github.com";

export async function fetchUser(username: string): Promise<GitHubUser> {
  console.log('1');
  const res = await fetch(`${BASE_URL}/users/${username}`);
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error("FETCH_ERROR");
  const data = await res.json();
  return GitHubUserSchema.parse(data);
}

export async function fetchUserRepos(
  username: string,
  page: number,
  sort: RepoSort = "created",
  direction: SortDirection = "desc",
  perPage = 10
): Promise<GitHubRepo[]> {
  console.log('2');
  const res = await fetch(
    `${BASE_URL}/users/${username}/repos?sort=${sort}&direction=${direction}&page=${page}&per_page=${perPage}&type=owner`
  );
  if (!res.ok) throw new Error("FETCH_ERROR");
  const data = await res.json();
  return data.map((repo: unknown) => GitHubRepoSchema.parse(repo));
}
