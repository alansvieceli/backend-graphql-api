const db = require('../../config/db');

module.exports = {
  perfis(usuario) {
    return db('tb_perfil')
      .join('usuarios_perfis', 'perfis.id', 'usuarios_perfis.perfil_id')
      .where({ usuario_id: usuario.id });
  },
};
