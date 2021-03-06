exports.up = function (knex) {
  return knex.schema
    .createTable('tb_perfil', table => {
      table.increments('id').primary();
      table.string('nome').notNull().unique();
      table.string('rotulo').notNull();
    })
    .then(function () {
      return knex('tb_perfil').insert([
        { nome: 'comum', rotulo: 'Comum' },
        { nome: 'admin', rotulo: 'Administrador' },
      ]);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tb_perfil');
};
