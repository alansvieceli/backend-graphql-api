const db = require('../../config/db');
const bcrypt = require('bcrypt-nodejs');
const { getUsuarioLogado } = require('../Common/usuario');

module.exports = {
  async login(_, { dados }) {
    const usuario = await db('tb_usuario').where({ email: dados.email }).first();

    if (!usuario) {
      throw new Error('Usuário invalido');
    }

    const saoIguais = bcrypt.compareSync(dados.senha, usuario.senha);

    if (!saoIguais) {
      throw new Error('Senha invalido');
    }

    return getUsuarioLogado(usuario);
  },
  usuarios(obj, args, ctx) {
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
