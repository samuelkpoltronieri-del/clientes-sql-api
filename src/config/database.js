const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../config/database.db");

const db = new sqlite3.Database(dbPath, (erro) => {
  if (erro) {
    console.error("❌ Erro ao conectar com o banco de dados", erro);
  } else {
    console.log("✔ Conectado com sucesso ao banco de dados, SQLite3");
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS clientes (
        id integer primary key AUTOINCREMENT,
        nome varchar(50) not null,
        CPF varchar(15) not null,
        email varchar(70) not null,
        telefone INT not null,
        endereco varchar(50) not null

        );`,
    (erro) => {
      if (erro) {
        console.error("❌Erro ao criar a tabela", erro);
      } else {
        console.log("✔ Tabela criada com sucesso ! ");
      }
    },
  );
});

module.exports = db;
