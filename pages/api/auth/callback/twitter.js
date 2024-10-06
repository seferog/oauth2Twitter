import cookie from "cookie";

export default async function handler(req, res) {
  const { code } = req.query;

  const cookies = cookie.parse(req.headers.cookie || "");
  const code_verifier = cookies.code_verifier;

  try {
    const client_id = process.env.TWITTER_CLIENT_ID;
    const redirect_uri = "http://localhost:3000/api/auth/callback/twitter";

    const tokenResponse = await fetch(
      "https://api.twitter.com/2/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirect_uri,
          client_id: client_id,
          code_verifier: code_verifier,
        }).toString(),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Oauth Error: ${errorData.error || "Unknown error"}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token } = tokenData;

    return res.redirect(
      `/?access_token=${access_token}&refresh_token=${refresh_token}`
    );
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Oauth Error" });
  }
}
