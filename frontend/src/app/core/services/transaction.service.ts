import { Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  apiUrl = 'http://localhost:5000/api/transactions';

  transactions = signal<Transaction[]>([]);

  constructor(
    private http: HttpClient
  ) {}

  getTransactions(filter: any = {}) {

    this.http.get<Transaction[]>(

      this.apiUrl,

      {
        params: filter
      }

    ).subscribe(res => {

      this.transactions.set(res);

    });

  }

  addTransaction(data: any) {

    return this.http.post(

      this.apiUrl,

      data

    ).pipe(

      tap(() => {

        this.getTransactions();

      })

    );

  }

  updateTransaction(
    id: string,
    data: any
  ) {

    return this.http.put(

      `${this.apiUrl}/${id}`,

      data

    ).pipe(

      tap(() => {

        this.getTransactions();

      })

    );

  }

  deleteTransaction(id: string) {

    return this.http.delete(

      `${this.apiUrl}/${id}`

    ).pipe(

      tap(() => {

        this.getTransactions();

      })

    );

  }

}