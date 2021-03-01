const db = require('../../config/db');

module.exports = {
  perfis() {
    return db('tb_perfil');
  },
  perfil(_, { filtro }) {
    if (!filtro) return null;
    const { id, nome } = filtro;
    if (id) {
      return db('tb_perfil').where({ id }).first();
    } else if (nome) {
      return db('tb_perfil').where({ nome }).first();
    } else {
      return null;
    }
  },
};
