/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('books', function (table) {
      table.increments('id').primary();
      table.string('isbn', 30).notNullable();
      table.text('image');
      table.string('title', 30).notNullable();
      table.string('author', 30).notNullable();
      table.string('publisher', 30).notNullable();
      table
        .integer('owner_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .notNullable();
      table.text('edition').notNullable();
    })

    .createTable('borrow_requests', function (table) {
      table.increments('id').primary();
      table
        .integer('book_id')
        .notNullable()
        .references('id')
        .inTable('books')
        .notNullable();
      table
        .integer('borrower_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .notNullable();
      table.date('return_by');
      table
        .enu('status', ['pending', 'approved', 'rejected'])
        .defaultTo('pending')
        .notNullable();
      table.text('comments', 100);
    })

    .createTable('borrowed_books', function (table) {
      table.increments('id').primary();
      table
        .integer('book_id')
        .notNullable()
        .references('id')
        .inTable('books')
        .notNullable();
      table
        .integer('borrower_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .notNullable();
      table.date('borrowed_date').notNullable();
      table.date('return_by').notNullable();
      table.date('returned_date');
    })

    .createTable('genres', function (table) {
      table.increments('id').primary();
      table.string('name', 20).unique().notNullable();
    })

    .createTable('genre_book_map', function (table) {
      table.increments('id').primary();
      table
        .integer('book_id')
        .notNullable()
        .references('id')
        .inTable('books')
        .notNullable();
      table
        .integer('genre_id')
        .notNullable()
        .references('id')
        .inTable('genres')
        .notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable('books')
    .dropTable('borrow_requests')
    .dropTable('borrowed_books')
    .dropTable('genres')
    .dropTable('genre_book_map');
};
