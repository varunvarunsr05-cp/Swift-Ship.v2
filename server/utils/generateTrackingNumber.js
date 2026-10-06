// Generates a SwiftShip-style tracking number e.g. SSP123456789
const generateTrackingNumber = () => {
  const digits = Math.floor(100000000 + Math.random() * 900000000);
  return `SSP${digits}`;
};

module.exports = generateTrackingNumber;
