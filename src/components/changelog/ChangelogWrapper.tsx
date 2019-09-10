import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChangelogs } from '../../store/changelog/changelog_actions';
import ChangelogModal from '../../components/changelog/ChangelogModal';
import { ApplicationState, store } from '../../store';
import { Changelog } from '../../store/changelog/changelogTypes';

const getPropsFromState = (state: ApplicationState) => ({
    changelogs: state.changelogs.data,
});

interface ChangelogStorage {
    viewed_version: number;
}

const CHANGELOG_LOCAL_KEY = 'SYFOOVERSIKT_CHANGELOG';

const getChangelogStorage = (): ChangelogStorage | undefined => {
    const stored = localStorage.getItem(CHANGELOG_LOCAL_KEY);
    return stored && JSON.parse(stored);
};

const createChangelogStorage = (version: number) => ({
    viewed_version: version,
}) as ChangelogStorage;

const saveChangelogVersionViewed = (version: number = 0) => {
    localStorage.setItem(CHANGELOG_LOCAL_KEY, JSON.stringify(createChangelogStorage(version)));
};

export default () => {

    const dispatch = useDispatch();
    const [showChangelog, setShowChangelog] = useState(false);
    const [latestChangelog, setLatestChangelog] = useState<Changelog | undefined>(undefined);

    useEffect(() => {
        dispatch(fetchChangelogs());
    }, []);

    const {
        changelogs,
    } = useSelector(getPropsFromState);

    useEffect(() => {
        if (changelogs.length === 0) return;
        const lastChangelog = [...changelogs].sort((a, b) => {
            return a.version > b.version
                ? -1
                : 1;
        })[0];

        if (lastChangelog === undefined) return;

        const storedSettings = getChangelogStorage();
        if (storedSettings) {
            setLatestChangelog(lastChangelog);
            setShowChangelog(storedSettings.viewed_version < lastChangelog.version);
        } else {
            setLatestChangelog(lastChangelog);
            setShowChangelog(true);
        }
    }, [changelogs]);

    return (
        <ChangelogModal onClose={(didComplete, version) => {
            setShowChangelog(false);
            saveChangelogVersionViewed(version);
          }} isOpen={showChangelog} changelog={latestChangelog} />
    );
};
