import { checkStatus, host } from './api';

const eventApi = {
  getAllFraud: () => {
    return fetch(`${host}/api/fraude`, {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
};

export default eventApi;
