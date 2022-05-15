
import passport from 'passport'
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const config = require('./config');

const jwt = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
  },
  async (user, done) => {
    done(null, user);
  }
);

passport.use(jwt);

module.exports = passport;
