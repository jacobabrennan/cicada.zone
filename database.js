

//== Database Configuration and Export =========================================

//-- Dependencies --------------------------------
import knex from 'knex';
import { USERNAME, PASSWORD } from './secure/database.js';

//-- Project Constants ---------------------------
const DATABASE_HOST = 'localhost';
const DATABASE_NAME = 'chirp';

//-- Configure database --------------------------
const config = {
    "client": "pg",
    "useNullAsDefault": true,
    "connection": {
        "host": DATABASE_HOST,
        "user": USERNAME,
        "password": PASSWORD,
        "database": DATABASE_NAME,
        "charset": "utf8"
    }
};
export default knex(config);
