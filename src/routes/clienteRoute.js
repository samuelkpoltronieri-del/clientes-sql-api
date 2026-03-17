// Importar o Express para criar o router
const express = require('express');
const router = express.Router();

// Importar as funções do Controller
const clienteController = require('../controllers/clientesController');

// ============================================================
// DEFINIÇÃO DAS ROTAS
// Cada rota chama uma função específica do Controller
// ============================================================

// IMPORTANTE: rotas mais específicas devem vir ANTES das genéricas!
// '/categoria/:cat' deve vir antes de '/:id'

// GET /clientes - Listar todos os clientes
router.get('/', clienteController.listarTodos);

// GET /clientes/cpf/:categoria - Buscar por categoria
router.get('/CPF/:CPF', clienteController.buscarPorCPF);

// GET /clientes/:id - Buscar cliente específico por ID
router.get('/:id', clienteController.buscarPorId);

// POST /clientes - Criar novo cliente
router.post('/', clienteController.criar);

// PUT /cliente/:id - Atualizar cliente completo
router.put('/:id', clienteController.atualizar);

// DELETE /cliente/:id - Deletar cliente
router.delete('/:id', clienteController.deletar);

// ============================================================
// EXPORTAR O ROUTER
// ============================================================
module.exports = router;
