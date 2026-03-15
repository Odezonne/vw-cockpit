const { AuthClient } = require('smartcar');

module.exports = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const client = new AuthClient({
      clientId: process.env.SMARTCAR_CLIENT_ID,
      clientSecret: process.env.SMARTCAR_CLIENT_SECRET,
      redirectUri: process.env.REDIRECT_URI,
      mode: 'live',
    });

    const access = await client.exchangeCode(code);

    // Redirect to app with token in URL fragment (stays client-side)
    res.redirect(`/?access_token=${access.accessToken}&expires_in=${access.expiration}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OAuth exchange failed', detail: err.message });
  }
};
