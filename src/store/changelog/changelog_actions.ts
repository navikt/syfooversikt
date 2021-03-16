import { Changelog } from './changelogTypes';

export enum ChangelogActionTypes {
  FETCH_CHANGELOGS_ASKED = 'FETCH_CHANGELOGS_ASKED',
  FETCH_CHANGELOGS_LOADING = 'FETCH_CHANGELOGS_LOADING',
  FETCH_CHANGELOGS_FAILED = 'FETCH_CHANGELOGS_FAILED',
  FETCH_CHANGELOGS_SUCCESS = 'FETCH_CHANGELOGS_SUCCESS',
}

interface FetchChangelogAction {
  type: ChangelogActionTypes.FETCH_CHANGELOGS_ASKED;
}

interface FetchChangelogLoadingAction {
  type: ChangelogActionTypes.FETCH_CHANGELOGS_LOADING;
}

interface FetchChangelogFailedAction {
  type: ChangelogActionTypes.FETCH_CHANGELOGS_FAILED;
}

interface FetchChangelogSuccessAction {
  type: ChangelogActionTypes.FETCH_CHANGELOGS_SUCCESS;
  data: Changelog[];
}

export type ChangelogAction =
  | FetchChangelogAction
  | FetchChangelogFailedAction
  | FetchChangelogSuccessAction
  | FetchChangelogLoadingAction;

export const fetchChangelogs = (): ChangelogAction => ({
  type: ChangelogActionTypes.FETCH_CHANGELOGS_ASKED,
});

export const fetchChengelogsLoadingAction = (): ChangelogAction => ({
  type: ChangelogActionTypes.FETCH_CHANGELOGS_LOADING,
});

export const fetchChangelogError = (): ChangelogAction => ({
  type: ChangelogActionTypes.FETCH_CHANGELOGS_FAILED,
});

export const fetchChangelogsSuccess = (data: Changelog[]): ChangelogAction => ({
  type: ChangelogActionTypes.FETCH_CHANGELOGS_SUCCESS,
  data,
});
