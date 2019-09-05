import { Reducer } from 'redux';
import { Changelog } from './changelogTypes';
import {
    ChangelogAction,
    ChangelogActionTypes,
} from './changelog_actions';

export const CHANGELOG_STATE_KEY = 'changelogs';

export interface ChangelogState {
    isLoading: boolean;
    isError: boolean;
    isFetched: boolean;
    data: Changelog[];
}

const inititalState: ChangelogState = {
    isError: false,
    isFetched: false,
    isLoading: false,
    data: [],
};

const changelogReducer: Reducer<ChangelogState, ChangelogAction> = (state = inititalState, action) => {
    switch (action.type) {
        case ChangelogActionTypes.FETCH_CHANGELOGS_SUCCESS: {
            return {
                ...state,
                data: action.data,
                isError: false,
                isFetched: true,
                isLoading: false,
            };
        }
        case ChangelogActionTypes.FETCH_CHANGELOGS_FAILED: {
            return {
                ...state,
                isError: true,
                isLoading: false,
            };
        }
        case ChangelogActionTypes.FETCH_CHANGELOGS_LOADING: {
            return {
                ...state,
                isLoading: true,
            };
        }
    }
    return state;
};

export default changelogReducer;
