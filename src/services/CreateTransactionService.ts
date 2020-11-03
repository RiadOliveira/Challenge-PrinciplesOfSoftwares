import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const { total } = this.transactionsRepository.getBalance();

    if (type === 'outcome' && total - value < 0) {
      throw Error('Valor excedeu o limite');
    }

    const newTrasaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return newTrasaction;
  }
}

export default CreateTransactionService;
