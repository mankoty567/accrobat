const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const sizeOf = require('image-size');

const MAX_MAP_SIZE = 1500;
const MAX_AVATAR_SIZE = 500;
const MAX_IMG_SUBMIT_SIZE = 1000;

module.exports = {
  pathToDistance: (path, echelle) => {
    let distance = 0;

    for (let i = 0; i < path.length - 1; i++) {
      distance =
        distance +
        Math.sqrt(
          Math.pow(path[i][0] - path[i + 1][0]) +
            Math.pow(path[i][1] - path[i + 1][1])
        );
    }

    return distance * echelle;
  },
  check_folder: () => {
    if (!fs.existsSync(path.join(__dirname, '../data'))) {
      fs.mkdirSync(path.join(__dirname, '../data'));
    }

    if (!fs.existsSync(path.join(__dirname, '../data/challenge'))) {
      fs.mkdirSync(path.join(__dirname, '../data/challenge'));
    }

    if (!fs.existsSync(path.join(__dirname, '../data/challengeAvatar'))) {
      fs.mkdirSync(path.join(__dirname, '../data/challengeAvatar'));
    }

    if (!fs.existsSync(path.join(__dirname, '../data/imageSubmition'))) {
      fs.mkdirSync(path.join(__dirname, '../data/imageSubmition'));
    }

    if (!fs.existsSync(path.join(__dirname, '../data/obstacle'))) {
      fs.mkdirSync(path.join(__dirname, '../data/obstacle'));
    }

    if (!fs.existsSync(path.join(__dirname, '../data/user'))) {
      fs.mkdirSync(path.join(__dirname, '../data/user'));
    }
  },
  parseMap: (b64) => {
    return resizeImage(b64, MAX_MAP_SIZE);
  },
  parseAvatar: (b64) => {
    return resizeImage(b64, MAX_AVATAR_SIZE);
  },
  parseImg: (b64) => {
    return resizeImage(b64, MAX_IMG_SUBMIT_SIZE);
  },
};

function resizeImage(b64, size) {
  return new Promise((resolve) => {
    let img_buffer = new Buffer.from(b64.split(/,\s*/)[1], 'base64');

    let imgSize = sizeOf(img_buffer);

    let newSize;
    if (imgSize.width > imgSize.height) {
      newSize = {
        width: size,
        height: Math.round((size * imgSize.height) / imgSize.width),
      };
    } else if (imgSize.height > imgSize.width) {
      newSize = {
        height: size,
        width: Math.round((size * imgSize.width) / imgSize.height),
      };
    } else {
      newSize = {
        height: size,
        width: size,
      };
    }

    sharp(img_buffer)
      .resize(newSize.width, newSize.height)
      .webp()
      .toBuffer()
      .then((newBuffer) => {
        resolve(newBuffer);
      });
  });
}
