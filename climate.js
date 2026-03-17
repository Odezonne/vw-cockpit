const smartcar = require('smartcar');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  const { action, temperature } = req.body;

  try {
    const vehicles = await smartcar.getVehicles(token);
    const vehicleId = vehicles.vehicles[0];
    const vehicle = new smartcar.Vehicle(vehicleId, token);

    if (action === 'start') {
      await vehicle.startClimate(temperature || 21);
      res.json({ success: true, message: `Climatisation démarrée à ${temperature || 21}°C` });
    } else if (action === 'stop') {
      await vehicle.stopClimate();
      res.json({ success: true, message: 'Climatisation arrêtée' });
    } else {
      res.status(400).json({ error: 'Action invalide. Utilise "start" ou "stop"' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
