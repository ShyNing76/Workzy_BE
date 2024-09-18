require('dotenv').config();
import {compareSync, hashSync} from "bcrypt";

const saltRounds = parseInt(process.env.SALT_ROUNDS);

export const hashPassword = (password) => {
    return hashSync(password, saltRounds);
}

export const comparePassword = (password, hash) => {
    return compareSync(password, hash);
}