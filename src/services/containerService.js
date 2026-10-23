const os = require('node:os');

function getContainerId() {
  return os.hostname();
}

module.exports = { getContainerId };
