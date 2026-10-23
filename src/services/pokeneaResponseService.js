const { getRandomPokenea } = require('./pokeneaService');
const { getContainerId } = require('./containerService');
const { getImageUrl } = require('./imageService');

function getRandomPokeneaJsonData() {
  const pokenea = getRandomPokenea();

  return {
    id: pokenea.getId(),
    nombre: pokenea.getNombre(),
    altura: pokenea.getAltura(),
    habilidad: pokenea.getHabilidad(),
    containerId: getContainerId()
  };
}

function getRandomPokeneaViewData() {
  const pokenea = getRandomPokenea();

  return [{
    pokenea: {
      nombre: pokenea.getNombre(),
      imagen: getImageUrl(pokenea.getImageKey()),
      fraseFilosofica: pokenea.getFraseFilosofica()
    },
    containerId: getContainerId()
  }];
}

module.exports = {
  getRandomPokeneaJsonData,
  getRandomPokeneaViewData
};
