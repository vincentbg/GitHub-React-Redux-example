import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { RepoInfo } from "./Repo";
import { Status } from "../../utils/enumeration";
import { getContributors, getGitHubInfo } from "./repoApi";

export interface RepoState {
  name: string;
  description: string;
  language: string;
  license?: License;
  stargazers_count: number;
  url: string;
  response: undefined | any;
  status: string;
  contributors_url: string;
  contributors: Contributor[];
  bookmarkContributors: Contributor[];
  showBookMarkContributor: boolean;
}
export interface Contributor {
  avatar_url: string;
  login: string;
  contributions: number;
}

export interface License {
  key: string;
  name: string;
  url: string;
}

const initialState: RepoState = {
  name: "",
  description: "",
  language: "",
  stargazers_count: 0,
  url: "",
  status: Status.Idle,
  contributors_url: "",
  response: undefined,
  contributors: [],
  bookmarkContributors: [],
  showBookMarkContributor: false,
};

export const callAsyncGitHub = createAsyncThunk(
  "repo/getGitHubInfo",
  async (data: RepoInfo) => {
    const { owner, repo } = data;
    const ownerTrimed = owner.trim();
    const repoTrimmed = repo.trim();

    if (!isNaN(+ownerTrimed) || !isNaN(+repoTrimmed)) {
      return;
    }
    const cached = isCached(ownerTrimed, repoTrimmed);
    const response = cached
      ? getCache(ownerTrimed, repoTrimmed)
      : await getGitHubInfo(ownerTrimed, repoTrimmed);
    if (!cached) setCache(response.data, ownerTrimed, repoTrimmed);
    return cached ? JSON.parse(response) : response.data;
  }
);

export const getContributorsAsync = createAsyncThunk(
  "repo/getContributorsAsync",
  async (url: string) => {
    const response = await getContributors(url);
    return response.data;
  }
);

function isCached(owner: string, repo: string) {
  const repoInfoString = `gitHubInfo-${owner}-${repo}`;
  const repoInfoCache = sessionStorage.getItem(repoInfoString);
  const repoInfo =
    repoInfoCache !== null && repoInfoCache !== "undefined"
      ? JSON.parse(repoInfoCache)
      : {};

  if (owner + "/" + repo === repoInfo.full_name) return true;

  return false;
}

function getCache(owner: string, repo: string) {
  const repoInfoString = `gitHubInfo-${owner}-${repo}`;
  return sessionStorage.getItem(repoInfoString);
}

function setCache(data: {}, owner: string, repo: string) {
  const repoInfoString = `gitHubInfo-${owner}-${repo}`;
  sessionStorage.setItem(repoInfoString, JSON.stringify(data));
}

export const repoSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {
    bookMarkContributors: (state, action: PayloadAction<Contributor[]>) => {
      state.bookmarkContributors = action.payload;
    },
    showBookMarkContributor: (state) => {
      state.showBookMarkContributor = !state.showBookMarkContributor;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(callAsyncGitHub.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(callAsyncGitHub.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          state.status = Status.Idle;
          return;
        }
        state.description = action.payload.description;
        state.url = action.payload.html_url;
        state.name = action.payload.name;
        state.response = action.payload;
        state.language = action.payload.language;
        state.license = action.payload.license;
        state.stargazers_count = action.payload.stargazers_count;
        state.contributors_url = action.payload.contributors_url;
        state.status = Status.Idle;
      })
      .addCase(callAsyncGitHub.rejected, (state) => {
        state.status = Status.Error;
      })
      .addCase(getContributorsAsync.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(getContributorsAsync.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          state.status = Status.Idle;
          return;
        }

        state.contributors = action.payload
          .map((x: Contributor) => ({
            login: x.login,
            avatar_url: x.avatar_url,
            contributions: x.contributions,
          }))
          .sort(
            (a: Contributor, b: Contributor) =>
              b.contributions - a.contributions
          );
        state.status = Status.Idle;
      })
      .addCase(getContributorsAsync.rejected, (state) => {
        state.status = Status.Error;
      });
  },
});

export const selectRepo = (state: RootState) => state.repo;
export const { bookMarkContributors, showBookMarkContributor } =
  repoSlice.actions;

export default repoSlice.reducer;
