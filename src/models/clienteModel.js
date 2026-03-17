// Importar a conexão com o banco de dados
const db = require('../config/database');

// ============================================================
// FUNÇÃO: listarTodos
// DESCRIÇÃO: Retorna todos os clientes do banco
// RETORNO: Promise que resolve com array de clientes
// ============================================================
function listarTodos() {
  // Retornamos uma Promise porque a operação é assíncrona
  return new Promise((resolve, reject) => {
    // SQL: SELECT busca todos os registros
    const sql = 'SELECT * FROM clientes';
    
    // db.all() busca múltiplas linhas
    // [] são os parâmetros (vazio neste caso)
    db.all(sql, [], (erro, linhas) => {
      if (erro) {
        reject(erro);    // Se der erro, rejeita a Promise
      } else {
        resolve(linhas); // Se sucesso, resolve com os dados
      }
    });
  });
}

// ============================================================
// FUNÇÃO: buscarPorId
// DESCRIÇÃO: Busca um clientes específico pelo ID
// PARÂMETRO: id (número) - identificador do clientes
// RETORNO: Promise que resolve com o clientes ou undefined
// ============================================================
function buscarPorId(id) {
  return new Promise((resolve, reject) => {
    // O '?' é um placeholder seguro
    // Isso previne SQL Injection!
    const sql = 'SELECT * FROM clientes WHERE id = ?';
    
    // db.get() busca uma única linha
    db.get(sql, [id], (erro, linha) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(linha);  // undefined se não encontrar
      }
    });
  });
}

// ============================================================
// FUNÇÃO: criar
// DESCRIÇÃO: Insere um novo cliente no banco
// PARÂMETRO: dados (objeto) - contém nome, CPF, email, telefone, endereco
// RETORNO: Promise que resolve com o cliente criado (com ID)
// ============================================================
function criar(dados) {
  return new Promise((resolve, reject) => {
    // Desestruturar os dados
    const { nome, CPF, email, telefone, endereco } = dados;
    
    // SQL: INSERT adiciona novo registro
    // IMPORTANTE: NÃO incluímos o ID aqui porque ele é AUTOINCREMENT
    // O SQLite gera o ID automaticamente!
    const sql = `
      INSERT INTO clientes (nome, CPF, email, telefone, endereco)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    // db.run() executa comandos INSERT/UPDATE/DELETE
    // IMPORTANTE: usar 'function' tradicional (não arrow function)
    // para ter acesso ao 'this.lastID'
    db.run(sql, [nome, CPF,email, telefone, endereco], function(erro) {
      if (erro) {
        reject(erro);
      } else {
        // this.lastID contém o ID que o banco gerou automaticamente
        // para o registro que acabamos de inserir
        resolve({
          id: this.lastID,
          nome,
          CPF,
          email,
          telefone,
          endereco
        });
      }
    });
  });
}

// ⚠️ NOTA IMPORTANTE SOBRE AUTOINCREMENT:
// Quando criamos a tabela, definimos o campo ID como AUTOINCREMENT.
// Isso significa que o BANCO DE DADOS é responsável por gerar o próximo ID.
// 
// Por isso:
// ❌ NÃO fazemos: INSERT INTO cliente (id, nome, ...) VALUES (?, ?, ...)
// ✅ Fazemos: INSERT INTO clientes (nome, CPF, ...) VALUES (?, ?, ...)
//
// O SQLite adiciona o ID automaticamente e podemos recuperá-lo usando this.lastID

// ============================================================
// FUNÇÃO: atualizar
// DESCRIÇÃO: Atualiza todos os dados de um cliente
// PARÂMETROS:
//   - id (número): identificador do cliente
//   - dados (objeto): novos dados
// RETORNO: Promise com cliente atualizado ou null
// ============================================================
function atualizar(id, dados) {
  return new Promise((resolve, reject) => {
    const { nome, CPF, email, telefone, endereco } = dados;
    
    // SQL: UPDATE modifica um registro existente
    const sql = `
      UPDATE clientes 
      SET nome = ?, CPF = ?, email = ?, telefone = ?, endereco = ?
      WHERE id = ?
    `;
    
    // Passar os parâmetros na ordem dos placeholders
    db.run(sql, [nome, CPF, email, telefone, endereco, id], function(erro) {
      if (erro) {
        reject(erro);
      } else if (this.changes === 0) {
        // this.changes = quantidade de linhas afetadas
        // Se for 0, o cliente não foi encontrado
        resolve(null);
      } else {
        // cliente atualizado com sucesso
        resolve({ id, nome, CPF, email, telefone, endereco });
      }
    });
  });
}

// ============================================================
// FUNÇÃO: deletar
// DESCRIÇÃO: Remove um cliente do banco
// PARÂMETRO: id (número) - identificador do cliente
// RETORNO: Promise com true (sucesso) ou false (não encontrado)
// ============================================================
function deletar(id) {
  return new Promise((resolve, reject) => {
    // SQL: DELETE remove um registro
    const sql = 'DELETE FROM clientes WHERE id = ?';
    
    db.run(sql, [id], function(erro) {
      if (erro) {
        reject(erro);
      } else {
        // Retorna true se deletou alguma linha
        resolve(this.changes > 0);
      }
    });
  });
}

// ============================================================
// FUNÇÃO: buscarPorCPF
// DESCRIÇÃO: Filtra clientes por CPF
// PARÂMETRO: CPF (string)
// RETORNO: Promise com array de clientes
// ============================================================
function buscarPorCPF(CPF) {
  return new Promise((resolve, reject) => {
    // LIKE permite busca com padrão
    // O % significa "qualquer texto antes/depois"
    const sql = 'SELECT * FROM clientes WHERE CPF LIKE ?';
    
    db.all(sql, [`%${CPF}%`], (erro, linhas) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(linhas);
      }
    });
  });
}

// ============================================================
// EXPORTAR TODAS AS FUNÇÕES
// ============================================================
module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  buscarPorCPF
};
