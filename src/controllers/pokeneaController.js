const { getRandomPokenea } = require('../services/pokeneaService');
const { getContainerId } = require('../services/containerService');
const { getImageUrl } = require('../services/imageService');

function getRandomData() {
  const pokenea = getRandomPokenea();
  return {
    id: pokenea.getId(),
    nombre: pokenea.getNombre(),
    altura: pokenea.getAltura(),
    habilidad: pokenea.getHabilidad(),
    containerId: getContainerId()
  };
}

function showRandomPokenea(req, res) {
  const pokenea = getRandomPokenea();
  const viewData = [{
    pokenea: {
      nombre: pokenea.getNombre(),
      imagen: getImageUrl(pokenea.getImageKey()),
      fraseFilosofica: pokenea.getFraseFilosofica()
    },
    containerId: getContainerId()
  }];

  res.render('pokenea', { data: viewData });
}

function getRandomPokeneaJson(req, res) {
  res.json(getRandomData());
}

module.exports = { getRandomPokeneaJson, showRandomPokenea };
