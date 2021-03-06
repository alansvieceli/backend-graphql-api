const db = require('../../config/db');
const bcrypt = require('bcrypt-nodejs');
const { perfil: obterPerfil } = require('../Query/perfil');
const { usuario: obterUsuario } = require('../Query/usuario');

const mutations = {
  async registrarUsuario(_, { dados }) {
    return await mutations.novoUsuario(_, {
      dados: {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
      },
    });
  },

  async novoUsuario(_, { dados }, ctx) {
    ctx && ctx.validarAdmin(); //if existe contexto executa a porra toda

    try {
      const idsPerfis = [];

      if (!dados.perfis || !dados.perfis.length) {
        dados.perfis = [
          {
            nome: 'comum',
          },
        ];
      }

      for (let filtro of dados.perfis) {
        const perfil = await obterPerfil(_, {
          filtro,
        });
        if (perfil) idsPerfis.push(perfil.id);
      }

      const salt = bcrypt.genSaltSync();
      dados.senha = bcrypt.hashSync(dados.senha, salt);

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

  async excluirUsuario(_, args, ctx) {
    ctx && ctx.validarAdmin(); //if existe contexto executa a porra toda

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

  async alterarUsuario(_, { filtro, dados }, ctx) {
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

        if (dados.senha) {
          const salt = bcrypt.genSaltSync();
          dados.senha = bcrypt.hashSync(dados.senha, salt);
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

module.exports = mutations;
