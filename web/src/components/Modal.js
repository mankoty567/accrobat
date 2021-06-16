import React from 'react';
import style from './Modal.module.css';

/**
 * Un modal (petite fenêtre popup) qui peut être utilisé dans l'application
 * @param {Object[]} props Props du composant
 * @returns
 */
export default function Modal(props) {
  /**
   * Fonction en cas de de sortie du modal
   */
  function quit() {
    if (props.onCancel !== undefined) props.onCancel();
  }

  return (
    <>
      {props.open ? (
        <>
          <div className={style.darkZone} onClick={quit}></div>
          <div className={style.modal}>
            {!props.onCancel ? null : (
              <svg
                onClick={quit}
                alt="Fermer"
                className={style.closeModal}
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="times"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 352 512"
              >
                <path
                  fill="currentColor"
                  d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                ></path>
              </svg>
            )}
            {props.children}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
