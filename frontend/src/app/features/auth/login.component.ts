import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card" style="max-width: 400px; margin: 40px auto;">
      <h2 style="margin-top: 0;">Login</h2>

      @if (error()) {
        <div class="alert alert-error">
          {{ error() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()">

        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            formControlName="email"
            class="form-control"
          >
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            formControlName="password"
            class="form-control"
          >
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          style="width: 100%;"
          [disabled]="form.invalid"
        >
          Login
        </button>

      </form>
    </div>
  `
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.auth.login(
      this.form.value.email!,
      this.form.value.password!
    ).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) =>
        this.error.set(
          err.error?.message || 'Login failed'
        )
    });
  }
}