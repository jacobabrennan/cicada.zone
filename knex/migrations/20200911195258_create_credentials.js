

//== Create Credentials Table ==================================================

//-- Constants -----------------------------------
const TABLE_USER = 'user';
const FIELD_ID = 'id';
const FIELD_USERNAME = 'username';
const FIELD_PASSWORD = 'password';
const FIELD_EMAIL = 'email';

//-- Migrations ----------------------------------
exports.up = function(knex) {
    // User
    return knex.schema.createTable(TABLE_USER, table => {
        table.increments(FIELD_ID);
        table.string(FIELD_USERNAME).unique().notNullable();
        table.string(FIELD_PASSWORD).notNullable();
        table.string(FIELD_EMAIL).unique().notNullable();
    });
};
exports.down = function(knex) {
    return knex.schema.dropTable(TABLE_USER);
};
