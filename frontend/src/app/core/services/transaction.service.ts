import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import {
  Transaction,
  Summary
} from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/transactions`;

  _transactions = signal<Transaction[]>([]);
  _summary = signal<Summary | null>(null);

  load(filters: any = {}) {

    const params = new URLSearchParams();

    if (filters.q) {
      params.set('q', filters.q);
    }

    if (filters.type) {
      params.set('type', filters.type);
    }

    if (filters.category) {
      params.set('category', filters.category);
    }

    this.http
      .get<{ data: Transaction[] }>(
        `${this.apiUrl}?${params.toString()}`
      )
      .subscribe(res => {
        this._transactions.set(res.data);
      });
  }

  loadSummary() {
    this.http
      .get<{ data: Summary }>(
        `${this.apiUrl}/summary`
      )
      .subscribe(res => {
        this._summary.set(res.data);
      });
  }

  create(payload: any) {
    return this.http.post(this.apiUrl, payload);
  }

  update(id: string, payload: any) {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      payload
    );
  }

  remove(id: string) {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}