export interface Transaction {
    _id: string;
    user: string;
  
    type: 'income' | 'expense';
  
    amount: number;
    category: string;
    description: string;
  
    date: string;
  
    createdAt?: string;
  }
  
  export interface Summary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  
    byCategory: {
      category: string;
      total: number;
    }[];
  }