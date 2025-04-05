import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

import { DoodlerInterface } from '@/types/models/doodler';
import { getRandomAvatarProps } from '@/utils/avatar';

interface UserContextInterface {
  user: DoodlerInterface;
  updateUser: <T extends keyof DoodlerInterface>(
    key: T,
    value: DoodlerInterface[T]
  ) => void;
  resetUser: () => void;
}

const defaultUser: DoodlerInterface = {
  id: '',
  name: '',
  avatar: getRandomAvatarProps(),
  score: 0,
};

const UserContext = createContext<UserContextInterface>({
  user: defaultUser,
  updateUser: () => {},
  resetUser: () => {},
});

const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<DoodlerInterface>(defaultUser);

  const updateUser: UserContextInterface['updateUser'] = (key, value) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  const resetUser = () => setUser(defaultUser);

  return (
    <UserContext.Provider value={{ user, updateUser, resetUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
