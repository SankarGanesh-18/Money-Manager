import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  template: `
    <div
      class="card"
      style="max-width: 400px; margin: 40px auto;"
    >
      <h2 style="margin-top: 0">
        Register
      </h2>

      @if (error()) {
        <div class="alert alert-error">
          {{ error() }}
        </div>
      }

      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
      >
        <div class="form-group">
          <label>Name</label>
          <input
            type="text"
            formControlName="name"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            formControlName="email"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            formControlName="password"
            class="form-control"
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          style="width: 100%;"
          [disabled]="form.invalid"
        >
          Register
        </button>
      </form>

      <p style="margin-top: 16px;">
        Already have an account?
        <a routerLink="/login">
          Login
        </a>
      </p>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = signal<string | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.auth.register(
      this.form.value.name!,
      this.form.value.email!,
      this.form.value.password!
    ).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err: any) =>
        this.error.set(
          err?.error?.message || 'Registration failed'
        )
    });
  }
}