import React from 'react';
import { useHistory } from 'react-router-dom';

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
    <>
      <h1>Dépassez vos limites</h1>
      <img src={`${process.env.PUBLIC_URL}/images/Running.jpg`} />
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
      <ul>
        <li>
          <p>
            De nombreuses courses à accomplir dans divers univers.
          </p>
        </li>
        <li>
          <p>Des défis à relever qui pimenterons votre expérience.</p>
        </li>
        <li>
          <p>Un classement mis à jour en temps réel.</p>
        </li>
        <li>
          <p>
            Un leveling fluide et récompensant les plus performants.
          </p>
        </li>
        <li>
          <p>Des succès pour montrer vos différentes prouesses.</p>
        </li>
      </ul>
      <h3>
        Qui n'a jamais rêvé de refaire le périple de la quête de
        l'anneau ?
      </h3>
      <button onClick={() => goToChallenges()}>
        Voir tous les challenges disponible
      </button>
    </>
  );
};

export default PublicPage;
