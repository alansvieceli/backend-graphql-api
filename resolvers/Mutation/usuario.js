const db = require('../../config/db');
const { perfil: obterPerfil } = require('../Query/perfil');
const { usuario: obterUsuario } = require('../Query/usuario');

module.exports = {
  async novoUsuario(_, { dados }) {
    try {
      const idsPerfis = [];
      if (dados.perfis) {
        for (let filtro of dados.perfis) {
          const perfil = await obterPerfil(_, {
            filtro,
          });
          if (perfil) idsPerfis.push(perfil.id);
        }
      }

      delete dados.perfis;
      const [id] = await db('tb_usuario').insert(dados);

      for (let perfil_id of idsPerfis) {
        await db('tb_usuario_perfil').insert({ perfil_id, usuario_id: id });
      }

      return db('tb_usuario').where({ id }).first();
    } catch (e) {
      throw new Error(e.sqlMessage);
    }
  },
  async excluirUsuario(_, args) {
    try {
      const usuario = await obterUsuario(_, args);
      if (usuario) {
        const { id } = usuario;
        await db('tb_usuario_perfil').where({ usuario_id: id }).delete();
        await db('tb_usuario').where({ id }).delete();
      }
      return usuario;
    } catch (e) {
      throw new Error(e.sqlMessage);
    }
  },
  async alterarUsuario(_, { filtro, dados }) {
    try {
      const usuario = await obterUsuario(_, { filtro });
      if (usuario) {
        const { id } = usuario;
        if (dados.perfis) {
          await db('tb_usuario_perfil').where({ usuario_id: id }).delete();

          for (let filtro of dados.perfis) {
            const perfil = await obterPerfil(_, {
              filtro,
            });

            if (perfil) {
              await db('tb_usuario_perfil').insert({
                perfil_id: perfil.id,
                usuario_id: id,
              });
            }
          }
        }

        delete dados.perfis;
        await db('tb_usuario').where({ id }).update(dados);
      }
      return !usuario ? null : { ...usuario, ...dados };
    } catch (e) {
      throw new Error(e);
    }
  },
};
