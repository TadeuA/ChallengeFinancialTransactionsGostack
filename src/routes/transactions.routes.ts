import { Router } from 'express';
import multer from 'multer';

import uploadConfig from "../config/upload"

import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

import DeleteTransactionService from '../services/DeleteTransactionService';
const upload = multer(uploadConfig)
import ImportTransactionsService from '../services/ImportTransactionService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  try {
    const transactions = await transactionsRepository.find();
    const balance = await transactionsRepository.getBalance();
    return response.json({ transactions, balance });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;

    const createTransaction = new CreateTransactionService();
    // transactionsRepository,

    const transaction = await createTransaction.execute({
      title,
      value,
      type,
      category,
    });
    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send()

 });

transactionsRouter.post('/import',upload.single('file'), async (request, response) => {
    const importTransaction = new ImportTransactionsService();

    const transaction = await importTransaction.execute(request.file.path)

    return response.json(transaction)
});

export default transactionsRouter;
