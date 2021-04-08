import {host} from "./eventApi";

const api = {
  addMarkers: ({marker, challengeId}) => {
    return fetch(`${host}/api/challenge/${challengeId}/point`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({...marker, frondId: marker.id, id: undefined})
    })
  }
};

export default api;