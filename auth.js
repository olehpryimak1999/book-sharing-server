require('dotenv').config();

const { OAuth2Client } = require('google-auth-library');
const DEFAULT_ISS = 'https://accounts.google.com';

async function verify(token) {
    const client = new OAuth2Client();

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.AUTH_CLIENT_ID,
        });
        const { aud, iss, sub } = ticket.getPayload();
        const valid = iss === DEFAULT_ISS && aud === process.env.AUTH_CLIENT_ID;

        return valid ? sub : false;
    } catch (e) {
        return false;
    }
}

async function getUserInfoByToken(token) {
    const client = new OAuth2Client();

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.AUTH_CLIENT_ID,
        });

        return ticket.getPayload();
    } catch (e) {
        console.error(e);
    }
}

module.exports = { verify, getUserInfoByToken };