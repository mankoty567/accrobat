const host = process.env.REACT_APP_HOST || "https://api.acrobat.bigaston.dev";

let checkStatus = (res) => {
	if (res.ok) {
		return res;
	} else {
		return res.text().then((msg) => { throw new Error(msg); });
	}
};


/**
 * File to communicate with Node API
 */
 const API = {
    createChallenge: (data) => {
        return fetch(`${host}/api/challenge/`, {
            headers: { 
                'Authorization': 'Bearer' + window.localStorage.getItem(`token`),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data.challenge)
        }).then(checkStatus).then(res => res.json());
    },
    createMarker: (data) => {
        return fetch(`${host}/api/challenge/${data.id_challenge}/point`, {
            headers: { 
                'Authorization': 'Bearer' + window.localStorage.getItem(`token`),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data.point)
        }).then(checkStatus).then(res => res.json());
    }
};

export default API;