const db = require('../../config/db');

module.exports = {
  usuarios() {
    return db('tb_usuario');
  },
  usuario(_, { filtro }) {
    if (!filtro) return null;
    const { id, email } = filtro;
    if (id) {
      return db('tb_usuario').where({ id }).first();
    } else if (email) {
      return db('tb_usuario').where({ email }).first();
    } else {
      return null;
    }
  },
};
