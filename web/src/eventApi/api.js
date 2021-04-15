import challengeApi from './challengeApi';
import checkpointApi from './checkpointApi';
import eventApi from './eventApi';
import imageSubmitionApi from './imageSubmitionApi';
import obstacleApi from './obstacleApi';
import participationApi from './participationApi';
import segmentApi from './segmentApi';
import userApi from './userApi';

export const host =
  process.env.REACT_APP_HOST || 'https://api.acrobat.bigaston.dev';

export const checkStatus = (res) => {
  if (res.ok) {
    return res;
  } else {
    return res.text().then((msg) => {
      throw new Error(msg);
    });
  }
};

export const API = {
  challenge: challengeApi,
  checkpoint: checkpointApi,
  event: eventApi,
  imageSubmition: imageSubmitionApi,
  obstacle: obstacleApi,
  participation: participationApi,
  segment: segmentApi,
  user: userApi,
};
