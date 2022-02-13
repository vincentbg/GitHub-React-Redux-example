import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import styles from "./Repo.module.css";
import {
  callAsyncGitHub,
  selectRepo,
  getContributorsAsync,
  bookMarkContributors,
  Contributor,
  showBookMarkContributor,
} from "./repoSlice";
import { data, LoaderSpinner } from "../../utils/loaderSpinnerUtils";
import { Status } from "../../utils/enumeration";

export interface RepoInfo {
  owner: string;
  repo: string;
}

export function Repo() {
  const state = useAppSelector(selectRepo);
  const dispatch = useAppDispatch();
  const [repoInfo, setRepoInfo] = React.useState<RepoInfo>({
    owner: "facebook",
    repo: "create-react-app",
  });
  const urlRef = React.useRef("");
  const loadingSpinner: LoaderSpinner = data[0];

  // Sequentially call contributors url once we have datas in the repo state
  React.useEffect(() => {
    urlRef.current !== state.contributors_url &&
      state.contributors_url !== "" &&
      state.status === Status.Idle &&
      dispatch(getContributorsAsync(state.contributors_url));
    urlRef.current = state.contributors_url;
  }, [dispatch, state.contributors_url, state.status]);

  if (state.status === Status.Loading)
    return (
      <div className={styles["loaderWrapper"]}>
        <div key={loadingSpinner.name}>
          <loadingSpinner.Component {...data[0].props} />
          <span>{loadingSpinner.name}</span>
        </div>
      </div>
    );

  return (
    <div>
      <div className={styles.row}>
        <span>
          <button
            className={styles.button}
            onClick={() => dispatch(showBookMarkContributor())}
          >
            {state.showBookMarkContributor ? "Hide" : "Show"} Bookmarked
            Contributors
          </button>
        </span>
        <span> Owner :</span>
        <input
          className={styles.textbox}
          aria-label="Owner"
          value={repoInfo.owner}
          onChange={(e) =>
            setRepoInfo((prev) => ({ ...prev, owner: e.target.value }))
          }
        />
        <span> Repository :</span>

        <input
          className={styles.textbox}
          aria-label="Repository"
          value={repoInfo.repo}
          onChange={(e) =>
            setRepoInfo((prev) => ({ ...prev, repo: e.target.value }))
          }
        />
        <button
          className={styles.button}
          onClick={() => {
            dispatch(callAsyncGitHub(repoInfo));
          }}
        >
          search
        </button>
      </div>
      {state.description !== "" && <Description />}
      {state.contributors.length > 0 && (
        <Contributors
          contributors={
            state.showBookMarkContributor
              ? state.bookmarkContributors
              : state.contributors
          }
        />
      )}
      {state.status === Status.Error && (
        <h4 style={{ color: "red" }}> Its not working, please try again </h4>
      )}
    </div>
  );
}

export function Description() {
  const repoInfo = useAppSelector(selectRepo);
  return (
    <table>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Language</th>
        <th>License</th>
        <th>Star Count</th>
        <th>Url</th>
      </tr>
      <tr>
        <td>{repoInfo.name}</td>
        <td>{repoInfo.description}</td>
        <td>{repoInfo.language ?? "N/A"}</td>
        <td>{repoInfo.license?.name ?? "N/A"}</td>
        <td>{repoInfo.stargazers_count}</td>
        <td style={{ maxWidth: "23rem" }}>
          <a href={repoInfo.url ?? ""}>{repoInfo.url}</a>
        </td>
      </tr>
    </table>
  );
}
export function Contributors(props: { contributors: Contributor[] }) {
  const { contributors } = props;
  const repoInfo = useAppSelector(selectRepo);
  const dispatch = useAppDispatch();

  return (
    <div className={styles.ContributorMainContent}>
      <button
        className={styles.button}
        onClick={() => dispatch(bookMarkContributors(repoInfo.contributors))}
      >
        BookMark contributors
      </button>
      <div className={styles["tableScroll"]}>
        <table>
          <tr>
            <th>Avatar</th>
            <th>Login</th>
            <th>contributions</th>
          </tr>
          <tbody>
            {contributors.map((x) => (
              <tr key={x.avatar_url}>
                <td>
                  <img src={x.avatar_url} className={"App-logo"} alt="logo" />
                </td>
                <td>{x.login}</td>
                <td>{x.contributions ?? "none found"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
