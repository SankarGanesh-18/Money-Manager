import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { TransactionService } from '../../core/services/transaction.service';
import { CATEGORIES } from '../../core/constants/categories';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private svc = inject(TransactionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categories = CATEGORIES;

  isEdit = signal(false);
  editId = signal<string | null>(null);
  error = signal<string | null>(null);

  form = this.fb.group({
    type: ['expense', Validators.required],
    amount: [
      0,
      [Validators.required, Validators.min(0.01)]
    ],
    category: ['Food', Validators.required],
    description: [''],
    date: [
      new Date().toISOString().substring(0, 10),
      Validators.required
    ]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit.set(true);
      this.editId.set(id);

      const tx = this.svc._transactions()
        .find(t => t._id === id);

      if (tx) {
        this.form.patchValue({
          type: tx.type,
          amount: tx.amount,
          category: tx.category,
          description: tx.description,
          date: tx.date.substring(0, 10)
        });
      }
    }
  }

  submit() {
    if (this.form.invalid) return;

    const payload = this.form.value;

    const obs = this.isEdit()
      ? this.svc.update(this.editId()!, payload)
      : this.svc.create(payload);

    obs.subscribe({
      next: () => this.router.navigate(['/transactions']),
      error: (err) =>
        this.error.set(
          err.error?.message || 'Save failed'
        )
    });
  }
}