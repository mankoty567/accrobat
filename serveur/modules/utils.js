const fs = require('fs');
const path = require('path');
const pngToJpeg = require('png-to-jpeg');

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
  pngParser: (img) => {
    return new Promise((resolve) => {
      let img_buffer = new Buffer.from(img.split(/,\s*/)[1], 'base64');

      if (img.startsWith('data:image/png;')) {
        pngToJpeg({ quality: 90 })(img_buffer).then((output) => {
          resolve(output);
        });
      } else {
        resolve(img_buffer);
      }
    });
  },
};
