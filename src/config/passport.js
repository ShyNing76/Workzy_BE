import { google } from "googleapis";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { v4 } from "uuid";
import * as controllers from "../controllers";

export const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_REDIRECT_URI,
            scope: [
                "profile",
                "email",
                "https://www.googleapis.com/auth/user.birthday.read",
                "https://www.googleapis.com/auth/user.phonenumbers.read",
                "https://www.googleapis.com/auth/contacts.readonly",
                "https://www.googleapis.com/auth/calendar",
            ],
        },
        async function (accessToken, refreshToken, profile, cb) {
            try {
                profile.token = v4();
                if (profile?.id) {
                    oauth2Client.setCredentials({ access_token: accessToken });

                    const peopleService = google.people({
                        version: "v1",
                        auth: oauth2Client,
                    });
                    const userInfo = await peopleService.people.get({
                        resourceName: "people/me",
                        personFields: "birthdays,phoneNumbers", // Specify fields you want
                    });

                    const birthday = userInfo.data.birthdays?.[0]?.date;
                    profile.birthdays = birthday
                        ? new Date(
                              birthday.year,
                              birthday.month - 1,
                              birthday.day + 1
                          )
                        : null;
                    profile.phoneNumbers = userInfo.data.phoneNumbers || [];

                    profile.response = await controllers.loginGoogle(profile);
                }
            } catch (err) {
                console.log(err);
            }
            return cb(null, profile);
        }
    )
);
