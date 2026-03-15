const { AuthClient } = require('smartcar');

module.exports = (req, res) => {
  const client = new AuthClient({
    clientId: process.env.SMARTCAR_CLIENT_ID,
    clientSecret: process.env.SMARTCAR_CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    mode: 'live',
  });

  const authUrl = client.getAuthUrl(['read_vehicle_info', 'read_battery', 'read_charge', 'read_location', 'control_climate', 'read_climate'], {
    state: 'vw-cockpit',
  });

  res.redirect(authUrl);
};
