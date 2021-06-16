import React, { useEffect } from 'react';
import { API } from '../../eventApi/api';
import { useRecoilState } from 'recoil';
import { useHistory } from 'react-router-dom';
/**
 * Middleware permettant de demander le login de la personne
 * @param {JSX.Element} children Tous les composants mis entre les balises
 * @param {Boolean} admin Demande d'être administration
 * @param {Number} [permission] La permission minimale demandée pour arriver (admin ou créateur)
 * @param {Boolean} redirect Si le composant redirige
 * @param {String} [path] L'url sur laquelle nous redirigeons
 */
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

  //Variable d'interface
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
