async function criarConexao(){
    const sqlite = require('sqlite');
    const config = require('./config');
    
    const db =  await sqlite.open(config);
    
    db.run("CREATE TABLE if not exists lucros (id INTEGER, titulo TEXT, valor REAL, data_criada DATE)");
    db.run("CREATE TABLE if not exists gastos (id INTEGER, titulo TEXT, valor REAL, data_criada DATE)");

    return db;
}

module.exports = criarConexao;
