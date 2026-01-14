import { useQueryClient } from 'react-query';
export const useRefreshData = () => {
  const queryClient = useQueryClient();
  const refreshQuery = (queryKey) => {
    queryClient.invalidateQueries(queryKey);
  };
  const refreshAll = () => {
    queryClient.invalidateQueries();
  };
  const refreshMultiple = (queryKeys) => {
    queryKeys.forEach(key => queryClient.invalidateQueries(key));
  };
  return {
    refreshQuery,
    refreshAll,
    refreshMultiple,
  };
};
