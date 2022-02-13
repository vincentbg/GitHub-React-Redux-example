import axios from "axios";
import { getConfig } from "../../utils/apiUtils";

export const githubBaseUrl = "Shapefiles";
const baseUrl = "https://api.github.com/";

export function getGitHubInfo(owner: string, repo: string): Promise<any> {
  return axios.get(`${baseUrl}repos/${owner}/${repo}`, getConfig());
}

export function getContributors(url: string): Promise<any> {
  return axios.get(url, getConfig());
}
export function getUserRepos(owner: string): Promise<any> {
  return axios.get(
    `${baseUrl}users/${owner}/repos`,

    getConfig()
  );
}
