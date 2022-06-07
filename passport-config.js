/** @format */

const { UserGame } = require('./models');
const bcrypt = require('bcrypt');
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await UserGame.findOne({ where: { username: username } });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const passVal = await bcrypt.compare(password, user.password);
      if (!passVal) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id_user);
});

passport.deserializeUser(function (id_user, done) {
  UserGame.findByPk(id_user).then(function (user) {
    done(null, user);
  });
});
