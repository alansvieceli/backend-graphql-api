const db = require('../../config/db');

module.exports = {
  usuarios(perfil) {
    return db('tb_usuario')
      .join('usuarios_perfis', 'usuarios.id', 'usuarios_perfis.usuario_id')
      .where({ perfil_id: perfil.id });
  },
};
