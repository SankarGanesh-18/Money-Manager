import {
    Component,
    inject,
    OnInit,
    computed
  } from '@angular/core';
  
  import { CommonModule } from '@angular/common';
  import { RouterLink } from '@angular/router';
  
  import { TransactionService } from '../../core/services/transaction.service';
  
  @Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
  
    template: `
      <h2>Dashboard</h2>
  
      <div
        style="
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        "
      >
        <div class="card">
          <h4>Total Income</h4>
          <h2 style="color: var(--success); margin: 0;">
            {{ totalIncome() | currency:'INR' }}
          </h2>
        </div>
  
        <div class="card">
          <h4>Total Expense</h4>
          <h2 style="color: var(--danger); margin: 0;">
            {{ totalExpense() | currency:'INR' }}
          </h2>
        </div>
  
        <div class="card">
          <h4>Balance</h4>
          <h2 style="margin: 0;">
            {{ balance() | currency:'INR' }}
          </h2>
        </div>
      </div>
  
      <div class="card" style="margin-bottom: 32px;">
        <h3 style="margin-top: 0;">
          Expenses by Category
        </h3>
        <br>
  
        <div class="bar-chart">
  
          @for (item of byCategory(); track item.category) {
  
            <div class="bar-row">
  
              <span>
                {{ item.category }}
              </span>
  
              <div class="bar-track">
                <div
                  class="bar-fill"
                  [style.width.%]="
                    (item.total / maxCategoryTotal()) * 100
                  "
                ></div>
              </div>
  
              <span style="text-align: right;">
                {{ item.total | currency:'INR' }}
              </span>
  
            </div>
  
          } @empty {
  
            <p>No expenses this month.</p>
  
          }
  
        </div>
      </div>
  
      <a
        routerLink="/transactions"
        class="btn btn-primary"
      >
        Manage Transactions
      </a>
    `,
  
    styles: [`
      .bar-chart {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
  
      .bar-row {
        display: grid;
        grid-template-columns: 140px 1fr 100px;
        align-items: center;
        gap: 12px;
      }
  
      .bar-track {
        background: #e5e7eb;
        border-radius: 4px;
        height: 24px;
        overflow: hidden;
      }
  
      .bar-fill {
        height: 100%;
        background: var(--primary);
        border-radius: 4px;
        transition: width 0.3s ease;
      }
    `]
  })
  export class DashboardComponent implements OnInit {
  
    svc = inject(TransactionService);
  
    totalIncome = computed(
      () => this.svc._summary()?.totalIncome || 0
    );
  
    totalExpense = computed(
      () => this.svc._summary()?.totalExpense || 0
    );
  
    balance = computed(
      () => this.svc._summary()?.balance || 0
    );
  
    byCategory = computed(
      () => this.svc._summary()?.byCategory || []
    );
  
    maxCategoryTotal = computed(() =>
      Math.max(
        ...this.byCategory().map(c => c.total),
        1
      )
    );
  
    ngOnInit() {
      this.svc.loadSummary();
    }
  }