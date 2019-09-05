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
    err?: any;
}

interface FetchChangelogSuccessAction {
    type: ChangelogActionTypes.FETCH_CHANGELOGS_SUCCESS;
    data: Changelog[];
}

export type ChangelogAction =
    FetchChangelogAction
    | FetchChangelogFailedAction
    | FetchChangelogSuccessAction
    | FetchChangelogLoadingAction;

export const fetchChangelogs = () => ({
    type: ChangelogActionTypes.FETCH_CHANGELOGS_ASKED,
}) as FetchChangelogAction;

export const fetchChengelogsLoadingAction = () => ({
    type: ChangelogActionTypes.FETCH_CHANGELOGS_LOADING,
}) as FetchChangelogLoadingAction;

export const fetchChangelogError = (err?: any) => ({
    type: ChangelogActionTypes.FETCH_CHANGELOGS_FAILED,
    err,
}) as FetchChangelogFailedAction;

export const fetchChangelogsSuccess = (data: Changelog[]) => ({
    type: ChangelogActionTypes.FETCH_CHANGELOGS_SUCCESS,
    data,
}) as FetchChangelogSuccessAction;
