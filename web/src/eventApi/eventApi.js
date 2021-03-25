const host =
  process.env.REACT_APP_HOST || 'https://api.acrobat.bigaston.dev';

let checkStatus = (res) => {
  if (res.ok) {
    return res;
  } else {
    return res.text().then((msg) => {
      throw new Error(msg);
    });
  }
};

/**
 * File to communicate with Node API
 */
const API = {
  getChallenges: () => {
    return fetch(`${host}/api/challenge`, {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  getAdminChallenges: () => {
    return fetch(`${host}/api/challenge/admin`, {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  getChallenge: (data) => {
    return fetch(
      `${host}/api/challenge/${data.challenge_id}?include=${data.include}`,
      {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer ' + window.localStorage.getItem('token'),
        },
      },
    )
      .then(checkStatus)
      .then((res) => res.json());
  },
  createChallenge: (data) => {
    return fetch(`${host}/api/challenge`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.challenge),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  updateChallenge: (data) => {
    return fetch(`${host}/api/challenge/${data.challenge_id}`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.challenge),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  deleteChallenge: (data) => {
    return fetch(`${host}/api/challenge/${data.challenge_id}`, {
      method: 'DELETE',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  cloneChallenge: (data) => {
    return fetch(`${host}/api/challenge/${data.challenge_id}/clone`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  getMarkers: () => {
    return fetch(
      `${host}/api/challenge/${data.challenge_id}/point?include=${data.include}`,
      {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer ' + window.localStorage.getItem('token'),
        },
      },
    )
      .then(checkStatus)
      .then((res) => res.json());
  },
  createMarker: (data) => {
    return fetch(`${host}/api/challenge/${data.challenge_id}/point`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.marker),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  updateMarker: (data) => {
    return fetch(`${host}/api/pointpassage/${data.marker_id}`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.marker),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  deleteMarker: (data) => {
    return fetch(`${host}/api/pointpassage/${data.marker_id}`, {
      method: 'DELETE',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  getSegment: () => {
    return fetch(
      `${host}/api/segment/${data.segment_id}?include=${data.include}`,
      {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer ' + window.localStorage.getItem('token'),
        },
      },
    )
      .then(checkStatus)
      .then((res) => res.json());
  },
  createSegment: (data) => {
    return fetch(`${host}/api/segment`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.segment),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  updateSegment: (data) => {
    return fetch(`${host}/api/segment/${data.segment_id}`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.segment),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  deleteSegment: (data) => {
    return fetch(`${host}/api/segment/${data.segment_id}`, {
      method: 'DELETE',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  createObstacle: (data) => {
    return fetch(`${host}/api/obstacle`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.obstacle),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  updateObstacle: (data) => {
    return fetch(`${host}/api/obstacle/${data.obstacle_id}`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.obstacle),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  deleteObstacle: (data) => {
    return fetch(`${host}/api/obstacle/${data.obstacle_id}`, {
      method: 'DELETE',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  getParticipations: (data) => {
    return fetch(`${host}/api/participation`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.participation),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  createParticipation: (data) => {
    return fetch(`${host}/api/participation`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.participation),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  getProgression: (data) => {
    return fetch(
      `${host}/api/participation/${data.participation_id}/whereiam`,
      {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer ' + window.localStorage.getItem('token'),
        },
      },
    )
      .then(checkStatus)
      .then((res) => res.json());
  },
};

export default API;
