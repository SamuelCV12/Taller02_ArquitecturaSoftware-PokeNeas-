const {
  getRandomPokeneaJsonData,
  getRandomPokeneaViewData
} = require('../services/pokeneaResponseService');

function showRandomPokenea(req, res) {
  res.render('pokenea', { data: getRandomPokeneaViewData() });
}

function getRandomPokeneaJson(req, res) {
  res.json(getRandomPokeneaJsonData());
}

module.exports = { getRandomPokeneaJson, showRandomPokenea };
