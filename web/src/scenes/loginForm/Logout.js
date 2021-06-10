import { useEffect } from 'react';

import { API } from '../../eventApi/api';
import { useRecoilState } from 'recoil';
import { useHistory } from 'react-router-dom';

export default function Logout() {
  const history = useHistory();

  const [, setUserState] = useRecoilState(API.user.userAtom);

  useEffect(() => {
    localStorage.setItem('token', undefined);
    setUserState(undefined);

    history.push('/login');
  }, []);

  return <></>;
}
