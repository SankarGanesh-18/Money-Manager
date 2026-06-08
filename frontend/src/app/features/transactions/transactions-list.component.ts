import {
    Component,
    inject,
    OnInit,
    signal,
    effect
  } from '@angular/core';
  
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { RouterLink } from '@angular/router';
  
  import { TransactionService } from '../../core/services/transaction.service';
  import { CATEGORIES } from '../../core/constants/categories';
  
  @Component({
    selector: 'app-transactions-list',
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      RouterLink
    ],
    templateUrl: './transactions-list.component.html',
    styleUrls: ['./transactions-list.component.css']
  })
  export class TransactionsListComponent implements OnInit {
  
    svc = inject(TransactionService);
  
    categories = CATEGORIES;
  
    // Filter signals
    searchTerm = signal('');
    categoryFilter = signal('');
    typeFilter = signal('');
  
    transactions = this.svc._transactions;
  
    constructor() {
      effect(() => {
        const filters = {
          q: this.searchTerm(),
          category: this.categoryFilter(),
          type: this.typeFilter()
        };
  
        this.svc.load(filters);
      });
    }
  
    ngOnInit() {
      this.svc.load();
    }
  
    remove(id: string) {
      if (!confirm('Delete this transaction?')) {
        return;
      }
  
      this.svc.remove(id).subscribe(() => {
        this.svc.load({
          q: this.searchTerm(),
          category: this.categoryFilter(),
          type: this.typeFilter()
        });
      });
    }
  }