const { google } = require('googleapis');
const bdd = require('../../models');
const jwt = require('jsonwebtoken');

const googleClient = new google.auth.OAuth2(
  process.env.GOOGLE_ID,
  process.env.GOOGLE_SECRET,
  process.env.HOST + '/api/google/redirect'
);

const FRONT_URL = process.env.FRONT_HOST + '/google_return';

module.exports = {
  initialize_google: (req, res) => {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/fitness.activity.write',
    ];

    const google_url = googleClient.generateAuthUrl({
      access_type: 'offline',

      scope: scopes,
      prompt: 'consent',
    });

    res.redirect(google_url);
  },
  redirect_google: (req, res) => {
    googleClient.getToken(req.query.code).then((token, err) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
        return;
      }

      let googleUser = new google.auth.OAuth2(
        process.env.GOOGLE_ID,
        process.env.GOOGLE_SECRET,
        process.env.HOST + '/api/google/redirect'
      );

      googleUser.credentials = { access_token: token.tokens.access_token };

      let service = google.oauth2({
        version: 'v2',
        auth: googleUser,
      });

      service.userinfo.get(function (errInfo, result) {
        if (errInfo) {
          console.log(errInfo);
          res.status(500).send(errInfo);
        } else {
          let data = result.data;

          bdd.User.findOne({ where: { email: data.email } }).then((user) => {
            if (user === null) {
              bdd.User.create({
                username: data.email.split('@')[0] + Date.now(),
                email: data.email,
                permission: 0,
                level: 0,
                xp: 0,
                googleToken: token.tokens.refresh_token,
              }).then(() => {
                sendUser(res, user);
              });
            } else {
              user.googleToken = token.tokens.refresh_token;

              user.save().then(() => {
                sendUser(res, user);
              });
            }
          });
        }
      });
    });
  },
};

function sendUser(res, user) {
  let token = jwt.sign(
    {
      id: user.id,
      permission: user.permission,
    },
    process.env.JWT_SECRET,
    { expiresIn: '3h' }
  );

  res.redirect(FRONT_URL + '?jwt=' + token);
}
