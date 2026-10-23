const express = require('express');
const {
  getRandomPokeneaJson,
  showRandomPokenea
} = require('../controllers/pokeneaController');

const router = express.Router();

router.get('/api/pokenea', getRandomPokeneaJson);
router.get('/pokenea', showRandomPokenea);
router.get('/', showRandomPokenea);

module.exports = router;
