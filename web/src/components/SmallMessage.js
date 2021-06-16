import React from 'react';
import style from './SmallMessage.module.css';
import classnames from 'classnames';

/**
 * Composant permettant d'afficher un petit message
 * @param {String} type Type de message
 * @param {String} message Le message à afficher
 * @returns
 */
export default function SmallMessage({ type, message }) {
  return !!message ? (
    <p className={classnames([style.message], [style[type]])}>
      {message}
    </p>
  ) : null;
}
