const db = require('../../config/db');
const { perfil: obterPerfil } = require('../Query/perfil');

module.exports = {
  async novoPerfil(_, { dados }) {
    try {
      const [id] = await db('tb_perfil').insert(dados);
      return db('tb_perfil').where({ id }).first();
    } catch (e) {
      throw new Error(e.sqlMessage);
    }
  },
  async excluirPerfil(_, args) {
    try {
      const perfil = await obterPerfil(_, args);
      if (perfil) {
        const { id } = perfil;
        await db('tb_usuario_perfil').where({ perfil_id: id }).delete();
        await db('tb_perfil').where({ id }).delete();
      }
      return perfil;
    } catch (e) {
      throw new Error(e.sqlMessage);
    }
  },
  async alterarPerfil(_, { filtro, dados }) {
    try {
      const perfil = await obterPerfil(_, { filtro });
      if (perfil) {
        const { id } = perfil;
        await db('tb_perfil').where({ id }).update(dados);
      }
      return { ...perfil, ...dados };
    } catch (e) {
      throw new Error(e.sqlMessage);
    }
  },
};
