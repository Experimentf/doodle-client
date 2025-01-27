import { useContext } from 'react';

import { UserContext } from './UserContext';

export const useUser = () => {
  const { user, updateUser, resetUser } = useContext(UserContext);
  return { user, updateUser, resetUser };
};
