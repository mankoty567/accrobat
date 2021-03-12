const bdd = require('../../models');

module.exports = {
  get_image: (req, res) => {
    bdd.ImageSubmition.findOne({
      where: { EventId: req.params.id },
    }).then((imagesubmition) => {
      if (imagesubmition === null) {
        res.status(404).send('Not found');
      } else {
        let img = new Buffer.from(
          imagesubmition.img.replace(/^.*base64,/, ''),
          'base64'
        );
        var mime = imagesubmition.img.match(
          /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
        )[1];

        res.writeHead(200, {
          'Content-Type': mime,
          'Content-Length': img.length,
        });
        res.end(img);
      }
    });
  },
};
