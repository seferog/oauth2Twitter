import axios from "axios";

export default async function handler(req, res) {
  const { access_token } = req.query;

  if (!access_token) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    const response = await axios.get(
      "https://api.twitter.com/2/users/me?user.fields=profile_image_url",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching Twitter user data:", error);
    return res.status(500).json({ error: "Failed to fetch user data" });
  }
}
