import { useQuery } from '@tanstack/react-query';
import { Changelog } from '@/api/types/changelogTypes';
import { get } from '@/api/axios';
import { CHANGELOG_ROOT } from '@/apiConstants';

export const changelogsQueryKeys = {
  changelogs: ['changelogs'],
};

export const useChangelogsQuery = () => {
  const fetchChangelogs = () => get<Changelog[]>(CHANGELOG_ROOT);

  return useQuery({
    queryKey: changelogsQueryKeys.changelogs,
    queryFn: fetchChangelogs,
  });
};
