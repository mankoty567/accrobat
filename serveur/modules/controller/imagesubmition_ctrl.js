const bdd = require('../../models');
const path = require('path');

module.exports = {
  get_image: (req, res) => {
    bdd.ImageSubmition.findOne({
      where: { EventId: req.params.id },
    }).then((imagesubmition) => {
      if (imagesubmition === null) {
        res.status(404).send('Not found');
      } else {
        res.sendFile(
          path.join(
            __dirname,
            '../../data/imageSumbition/' + imagesubmition.id + '.jpg'
          )
        );
      }
    });
  },
};
