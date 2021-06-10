import React from 'react';

import style from './SmallMessage.module.css';

import classnames from 'classnames';

export default function SmallMessage({ type, message }) {
  return !!message ? (
    <p className={classnames([style.message], [style[type]])}>
      {message}
    </p>
  ) : null;
}
