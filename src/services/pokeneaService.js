const pokeneas = require('../data/pokeneas');

function getRandomPokenea() {
  const index = Math.floor(Math.random() * pokeneas.length);
  return pokeneas[index];
}

module.exports = { getRandomPokenea };
