const express = require("express");
const { ExpressAuth } = require("@auth/express");
const SequelizeAdapter = require("@auth/sequelize-adapter");
const Credentials = require("@auth/express/providers/credentials");
const app = express();
const db = require("./models");
const argon2 = require("argon2");
const { User } = require("../../models");
// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use(
  "/auth/*",
  ExpressAuth({
    providers: [
      Credentials({
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
          email: {},
          password: {},
        },
        authorize: async (credentials) => {
          let user = null;
          // logic to verify if the user exists
          user = await getUserFromDb(credentials.email);

          if (!user) {
            // No user found, so this is their first attempt to login
            throw new Error("User not found.");
          }

          // return user object with the their profile data
          return user;
        },
      }),
    ],
    adapter: SequelizeAdapter(db.sequelize),
  }),
);

const getUserFromDb = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (user) {
    return user;
  }
  return null;
};
