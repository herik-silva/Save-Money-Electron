const sqlite3 = require('sqlite3');
const path = require('path');

module.exports = {
    filename: "./database/data.db",
    driver: sqlite3.Database
}