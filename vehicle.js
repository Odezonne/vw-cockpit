const smartcar = require('smartcar');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const vehicles = await smartcar.getVehicles(token);
    const vehicleId = vehicles.vehicles[0];
    const vehicle = new smartcar.Vehicle(vehicleId, token);

    const [info, battery, charge, location] = await Promise.allSettled([
      vehicle.attributes(),
      vehicle.battery(),
      vehicle.charge(),
      vehicle.location(),
    ]);

    res.json({
      info:     info.status     === 'fulfilled' ? info.value     : null,
      battery:  battery.status  === 'fulfilled' ? battery.value  : null,
      charge:   charge.status   === 'fulfilled' ? charge.value   : null,
      location: location.status === 'fulfilled' ? location.value : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
