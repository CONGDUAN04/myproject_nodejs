import { prisma } from "config/client";
import { URLSearchParams } from "node:url";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserWithRoleById } from "services/client/auth.services";
import { getUserSumCart } from "services/client/item.services";
import {
  comparePassword,
} from "services/user.service";
const configPassportLocal = () => {
  passport.use(
    new LocalStrategy({ passReqToCallback: true }, async function verify(
      req,
      username,
      password,
      callback
    ) {
      const { session } = req as any;
      if (session?.messages?.length) {
        session.messages = [];
      }
      console.log("check username/password", username, password);
      const user = await prisma.user.findUnique({
        where: { username: username },
      });
      if (!user) {
        //throw error
        // throw new Error(`${username} not found`);
        return callback(null, false, { message: `username/password Invalid` });
      }
      //compare password
      const isMath = await comparePassword(password, user.password);
      if (!isMath) {
        // throw new Error("Invalid password");
        return callback(null, false, { message: `username/password Invalid` });
      } else {
        return callback(null, user as any);
      }
    })
  );

  passport.serializeUser(function (user: any, callback) {
    callback(null, { id: user.id, username: user.username });
  });

  passport.deserializeUser(async function (user: any, callback) {
    const { id, username } = user;
    ///query to db
    const userInDB: any = await getUserWithRoleById(id);
    const sumCart = await getUserSumCart(id);
    console.log("check sumcar", sumCart);
    return callback(null, { ...userInDB, sumCart: sumCart });
  });
};
export default configPassportLocal;
