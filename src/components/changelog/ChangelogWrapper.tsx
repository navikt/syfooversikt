import React, { ReactElement, useEffect, useState } from 'react';
import ChangelogModal from '@/components/changelog/ChangelogModal';
import { Changelog } from '@/api/types/changelogTypes';
import { useChangelogsQuery } from '@/react-query/changelogHooks';

interface ChangelogStorage {
  viewed_version: number;
}

const CHANGELOG_LOCAL_KEY = 'SYFOOVERSIKT_CHANGELOG';

const getChangelogStorage = (): ChangelogStorage | undefined => {
  const stored = localStorage.getItem(CHANGELOG_LOCAL_KEY);
  return stored && JSON.parse(stored);
};

const createChangelogStorage = (version: number) =>
  ({
    viewed_version: version,
  } as ChangelogStorage);

const saveChangelogVersionViewed = (version = 0) => {
  localStorage.setItem(
    CHANGELOG_LOCAL_KEY,
    JSON.stringify(createChangelogStorage(version))
  );
};

export const ChangelogWrapper = (): ReactElement => {
  const changelogsQuery = useChangelogsQuery();
  const [showChangelog, setShowChangelog] = useState(false);

  const latestChangelog = changelogsQuery.data?.sort(
    (a: Changelog, b: Changelog) => {
      return a.version > b.version ? -1 : 1;
    }
  )[0];

  useEffect(() => {
    if (changelogsQuery.isSuccess) {
      const storedSettings = getChangelogStorage();
      setShowChangelog(
        storedSettings && latestChangelog
          ? storedSettings.viewed_version < latestChangelog.version
          : true
      );
    }
  }, [changelogsQuery.isSuccess, latestChangelog]);

  if (
    changelogsQuery.isLoading ||
    changelogsQuery.isError ||
    !latestChangelog
  ) {
    return <></>;
  }

  return (
    <ChangelogModal
      onClose={(didComplete, version) => {
        setShowChangelog(false);
        saveChangelogVersionViewed(version);
      }}
      isOpen={showChangelog}
      changelog={latestChangelog}
    />
  );
};
