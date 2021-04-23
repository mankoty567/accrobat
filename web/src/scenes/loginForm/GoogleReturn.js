import { useEffect } from 'react';

import { API } from '../../eventApi/api';
import { useRecoilState } from 'recoil';

import { useHistory } from 'react-router-dom';

export default function GoogleReturn() {
  const history = useHistory();

  const [, setUserState] = useRecoilState(API.user.userAtom);
  const [, setDoneConnection] = useRecoilState(
    API.user.doneConnectionAtom,
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jwt = urlParams.get('jwt');

    API.user
      .getDataFromJWT(jwt)
      .then((data) => {
        localStorage.setItem('jwt', data.jwt);
        setDoneConnection(true);
        setUserState(data);

        setTimeout(refreshJWT, API.user.JWT_VALIDITY);

        history.push('/home');
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function refreshJWT() {
    API.user
      .whoami()
      .then((data) => {
        localStorage.setItem('jwt', data.jwt);
        setDoneConnection(true);
        setUserState(data);

        setTimeout(refreshJWT, API.user.JWT_VALIDITY);
      })
      .catch((err) => {
        setDoneConnection(true);
      });
  }

  return <></>;
}
