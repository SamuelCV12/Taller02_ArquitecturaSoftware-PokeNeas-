class Pokenea {
  constructor(id, nombre, altura, habilidad, imageKey, fraseFilosofica) {
    this.setId(id);
    this.setNombre(nombre);
    this.setAltura(altura);
    this.setHabilidad(habilidad);
    this.setImageKey(imageKey);
    this.setFraseFilosofica(fraseFilosofica);
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getNombre() {
    return this.nombre;
  }

  setNombre(nombre) {
    this.nombre = nombre;
  }

  getAltura() {
    return this.altura;
  }

  setAltura(altura) {
    this.altura = altura;
  }

  getHabilidad() {
    return this.habilidad;
  }

  setHabilidad(habilidad) {
    this.habilidad = habilidad;
  }

  getImageKey() {
    return this.imageKey;
  }

  setImageKey(imageKey) {
    this.imageKey = imageKey;
  }

  getFraseFilosofica() {
    return this.fraseFilosofica;
  }

  setFraseFilosofica(fraseFilosofica) {
    this.fraseFilosofica = fraseFilosofica;
  }
}

module.exports = Pokenea;
