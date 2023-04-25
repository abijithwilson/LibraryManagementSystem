/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary();
    table.string('first_name', 20).notNullable();
    table.string('last_name', 20);
    table.string('user_name', 20).unique().notNullable();
    table.string('email', 255).unique().notNullable();
    table.string('password', 255).notNullable();
    table.string('salt', 300).notNullable();
    table.string('phone', 15).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
