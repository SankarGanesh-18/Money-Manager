export interface Transaction {

  _id?: string;

  user?: string;

  type: 'income' | 'expense';

  amount: number;

  category: string;

  description: string;

  date: string;

}