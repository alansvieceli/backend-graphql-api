const db = require('../../config/db');

module.exports = {
  perfis(usuario) {
    return db('tb_perfil')
      .join('tb_usuario_perfil', 'tb_perfil.id', 'tb_usuario_perfil.perfil_id')
      .where({ usuario_id: usuario.id });
  },
};
