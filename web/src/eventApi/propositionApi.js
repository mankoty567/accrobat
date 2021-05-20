import { checkStatus, host } from './api';

const propositionApi = {
  /**
   * Permet de récupérer toutes les propositions de challenges
   * @return tableau des propositions
   */
  getPropositions: () => {
    return fetch(`${host}/api/propositionchallenge`, {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  /**
   * Change le status d'une proposition
   * @param {Number} proposition_id L'id de la proposition à modifier
   * @param {String} status Le status parmis [waiting/accepted/refused]
   * @return la proposition
   */
  updateProposition: (proposition_id, status) => {
    return fetch(
      `${host}/api/propositionchallenge/${proposition_id}`,
      {
        method: 'POST',
        headers: {
          Authorization:
            'Bearer ' + window.localStorage.getItem('token'),
          'content-type': 'application/json',
        },
        body: JSON.stringify({ status: status }),
      },
    )
      .then(checkStatus)
      .then((res) => res.json());
  },
  /**
   * Ajoute une proposition liée à l'utilisateur courrant
   * @param {String} description Le texte de la proposition
   * @return OK
   */
  postProposition: (description) => {
    return fetch(`${host}/api/propositionchallenge`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'content-type': 'application/json',
      },
      body: JSON.stringify({ description }),
    })
      .then(checkStatus)
      .then((res) => res.text());
  },
};

export default propositionApi;
