exports.up = function (knex) {
  return knex.schema.createTable('tb_usuario_perfil', table => {
    table.integer('usuario_id').unsigned();
    table.integer('perfil_id').unsigned();
    table.foreign('usuario_id', 'fk_tb_usuario_perfil_tb_usuario').references('tb_usuario.id');
    table.foreign('perfil_id', 'fk_tb_usuario_perfil_tb_perfil').references('tb_perfil.id');
    table.primary(['usuario_id', 'perfil_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tb_usuario_perfil');
};
