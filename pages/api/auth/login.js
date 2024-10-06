import crypto from "crypto";

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString("base64url");
}

function generateCodeChallenge(code_verifier) {
  return crypto.createHash("sha256").update(code_verifier).digest("base64url");
}

export default async function handler(req, res) {
  const code_verifier = generateCodeVerifier();
  const code_challenge = generateCodeChallenge(code_verifier);

  res.setHeader("Set-Cookie", `code_verifier=${code_verifier}; Path=/`);

  const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
  const TWITTER_REDIRECT_URI =
    "http://localhost:3000/api/auth/callback/twitter";

  const twitterAuthUrl =
    `https://twitter.com/i/oauth2/authorize?` +
    `response_type=code&` +
    `client_id=${TWITTER_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(TWITTER_REDIRECT_URI)}&` +
    `scope=tweet.read%20users.read%20offline.access&` +
    `state=xyz123&` +
    `code_challenge=${code_challenge}&` +
    `code_challenge_method=S256`;

  res.status(200).json({ url: twitterAuthUrl });
}
