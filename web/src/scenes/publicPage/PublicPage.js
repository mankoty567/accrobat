import React from 'react';
import { useHistory } from 'react-router-dom';

import style from './PublicPage.module.css';
import classnames from 'classnames';

/**
 * Page publique de l'application web
 */
let PublicPage = () => {
  //Variable d'interface
  const history = useHistory();

  /**
   * Fonction pour rediriger l'utilisateur sur la page des challenges
   */
  const goToChallenges = () => {
    history.push('/challenges');
  };

  return (
    <div className={style.wrapper}>
      <h1>Dépassez vos limites</h1>
      <img
        className={style.img}
        src={`${process.env.PUBLIC_URL}/images/Running.jpg`}
      />
      <h3>Découvrez le nouveau défi à la mode : Run's Like</h3>
      <p>
        Vous en avez marre d'être toujours devant votre ordinateur et
        vous avez envie de changer ? N'attendez-plus, nous avons la
        solution !
      </p>
      <p>
        "Run's like" est une application qui vous permet de parcourir
        vos mondes préférés lors d'une compétition acharnée pour
        gagner de l'expérience, des succès et bien plus encore !
      </p>
      <h2>En bref</h2>
      <ul className={style.argList}>
        <li
          style={{
            listStyleImage: `url("${process.env.PUBLIC_URL}/images/running.svg")`,
          }}
        >
          De nombreuses courses à accomplir dans divers univers.
        </li>
        <li
          style={{
            listStyleImage: `url("${process.env.PUBLIC_URL}/images/dragon.svg")`,
          }}
        >
          Des défis à relever qui pimenterons votre expérience.
        </li>
        <li
          style={{
            listStyleImage: `url("${process.env.PUBLIC_URL}/images/crown.svg")`,
          }}
        >
          Un classement mis à jour en temps réel.
        </li>
        <li
          style={{
            listStyleImage: `url("${process.env.PUBLIC_URL}/images/arrow.svg")`,
          }}
        >
          Un leveling fluide et récompensant les plus performants.
        </li>
        <li
          style={{
            listStyleImage: `url("${process.env.PUBLIC_URL}/images/trophy.svg")`,
          }}
        >
          Des succès pour montrer vos différentes prouesses.
        </li>
      </ul>
      <h3>
        Qui n'a jamais rêvé de refaire le périple de la quête de
        l'anneau ?
      </h3>

      <img
        className={style.img}
        src={`${process.env.PUBLIC_URL}/images/Map.png`}
      />
      <button
        className={style.button}
        onClick={() => goToChallenges()}
      >
        Voir tous les challenges disponibles
      </button>
    </div>
  );
};

export default PublicPage;
