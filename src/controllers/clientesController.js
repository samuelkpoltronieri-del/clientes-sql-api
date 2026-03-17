// Importar as funções do Model
const clienteModel = require('../models/clienteModel');

// ============================================================
// FUNÇÃO: listarTodos (ASSÍNCRONA)
// ROTA: GET /clientes
// DESCRIÇÃO: Lista todos os clientes do banco de dados
// ============================================================
// A palavra 'async' antes da função permite usar 'await' dentro dela
async function listarTodos(req, res) {
  try {
    // 'await' pausa a execução até a Promise do Model resolver
    // É como "esperar" o banco de dados responder
    const clientes = await clienteModel.listarTodos();
    
    // Depois que os dados chegam, enviar a resposta
    res.status(200).json(clientes);
  } catch (erro) {
    // Se der qualquer erro, cai aqui
    res.status(500).json({ 
      mensagem: 'Erro ao listar clientes', 
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: buscarPorId (ASSÍNCRONA)
// ROTA: GET /clientes/:id
// ============================================================
async function buscarPorId(req, res) {
  try {
    const id = parseInt(req.params.id);
    
    // Validar o ID antes de consultar o banco
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    // Aguardar a busca no banco
    const cliente = await clienteModel.buscarPorId(id);
    
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ 
        mensagem: `Cliente ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao buscar cliente',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: criar (ASSÍNCRONA)
// ROTA: POST /clientes
// ============================================================
async function criar(req, res) {
  try {
    const { nome, CPF, email, telefone, endereco } = req.body;
    
    // Validações ANTES de tentar inserir no banco
    if (!nome || !CPF || !email || !telefone || !endereco) {
      return res.status(400).json({ 
        mensagem: 'Todos os campos são obrigatórios' 
      });
    }
    
    if (parseFloat(CPF) <= 0) {
      return res.status(400).json({ 
        mensagem: 'O CPF deve conter números' 
      });
    }
    
    // Aguardar a inserção no banco
    const novoCliente = await clienteModel.criar({ 
      nome, 
      CPF, 
      email, 
      telefone,
      endereco 
    });
    
    // Retornar o cliente criado com status 201
    res.status(201).json(novoCliente);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao criar cliente',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: atualizar (ASSÍNCRONA)
// ROTA: PUT /clientes/:id
// ============================================================
async function atualizar(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { nome, CPF, email, telefone, endereco } = req.body;
    
    // Validações
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    if (!nome || !CPF || !email || !telefone || !endereco) {
      return res.status(400).json({ 
        mensagem: 'Todos os campos são obrigatórios' 
      });
    }
    
    // Aguardar a atualização no banco
    const clienteAtualizado = await clienteModel.atualizar(id, { 
      nome, 
      CPF, 
      email, 
      telefone,
      endereco 
    });
    
    if (clienteAtualizado) {
      res.status(200).json(clienteAtualizado);
    } else {
      res.status(404).json({ 
        mensagem: `Cliente ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao atualizar cliente',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: deletar (ASSÍNCRONA)
// ROTA: DELETE /clientes/:id
// ============================================================
async function deletar(req, res) {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    // Aguardar a deleção no banco
    const deletado = await clienteModel.deletar(id);
    
    if (deletado) {
      res.status(200).json({ 
        mensagem: `Cliente ${id} removido com sucesso` 
      });
    } else {
      res.status(404).json({ 
        mensagem: `Cliente ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao deletar cliente',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: buscarPorCPF (ASSÍNCRONA)
// ROTA: GET /clientes/CPF/:CPF
// ============================================================
async function buscarPorCPF(req, res) {
  try {
    const { CPF } = req.params;
    
    // Aguardar a busca no banco
    const clientes = await clienteModel.buscarPorCPF(CPF);
    
    res.status(200).json(clientes);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao buscar clientes por CPF',
      erro: erro.message 
    });
  }
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
