import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import * as controllers from "../controllers";
import {v4} from "uuid";

passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/v1/auth/google/callback",
            scope: ["profile", "email"],
        },
        async function (accessToken, refreshToken, profile, cb) {
            try {
                profile.token = v4();
                if (profile?.id) {
                    profile.response = await controllers.loginGoogle(profile);
                }

            } catch (err) {
                console.log(err);
            }
            return cb(null, profile);
        }
    )
);