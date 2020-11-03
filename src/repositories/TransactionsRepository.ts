import { v4 as uuid } from 'uuid';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    if (this.transactions.length === 0) {
      throw Error('No transactions maded');
    }
    return this.transactions;
  }

  public getBalance(): Balance | Pick<Balance, 'total'> {
    if (this.transactions.length === 0) {
      const balance = { total: 0 };
      return balance;
    }

    const incomeTransactions = this.transactions.map(transaction => {
      if (transaction.type === 'income') {
        return transaction.value;
      }

      return 0;
    });

    const incomeValue = incomeTransactions.reduce((prev, next) => prev + next);

    const outcomeTransactions = this.transactions.map(transaction => {
      if (transaction.type === 'outcome') {
        return transaction.value;
      }

      return 0;
    });

    const outcomeValue = outcomeTransactions.reduce(
      (prev, next) => prev + next,
    );

    const total = incomeValue - outcomeValue;

    if (total < 0) {
      throw Error('Valor extrapolado');
    }

    const balance = {
      income: incomeValue,
      outcome: outcomeValue,
      total,
    };

    return balance;
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const newTransaction = {
      id: uuid(),
      title,
      value,
      type,
    };

    this.transactions.push(newTransaction);

    return newTransaction;
  }
}

export default TransactionsRepository;
