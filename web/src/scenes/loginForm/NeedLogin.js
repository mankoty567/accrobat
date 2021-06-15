import React, { useEffect } from 'react';

import { API } from '../../eventApi/api';
import { useRecoilState } from 'recoil';
import { useHistory } from 'react-router-dom';

export default function NeedLogin({
  children,
  admin,
  permission,
  redirect,
  path,
}) {
  if (!permission) {
    permission = 100;
  }
  if (!path) {
    path = '/home';
  }
  const history = useHistory();

  const [userState] = useRecoilState(API.user.userAtom);
  const [doneConnection] = useRecoilState(
    API.user.doneConnectionAtom,
  );

  useEffect(() => {
    if (redirect === false) return;

    if (doneConnection) {
      if (userState === undefined) {
        history.push('/login');
      } else {
        if (admin && userState.permission < permission) {
          history.push(path);
        }
      }
    }
  }, [userState, doneConnection]);

  return (
    <>
      {admin
        ? doneConnection && userState !== undefined
          ? userState.permission >= 100
            ? children
            : null
          : null
        : doneConnection && userState !== undefined
        ? children
        : null}
    </>
  );
}
