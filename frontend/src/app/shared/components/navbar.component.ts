import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav
      style="
        background: var(--primary);
        padding: 16px;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      "
    >
      <h2
        style="
          margin: 0;
          color: white;
          border: none;
          font-size: 20px;
        "
      >
        Money Manager
      </h2>

      <div style="display: flex; gap: 16px;">
        @if (auth.isAuthenticated()) {

          <a
            routerLink="/dashboard"
            style="color: white; text-decoration: none;"
          >
            Dashboard
          </a>

          <a
            (click)="auth.logout()"
            style="color: white; text-decoration: none; cursor: pointer;"
          >
            Logout
          </a>

        } @else {

          <a
            routerLink="/login"
            style="color: white; text-decoration: none;"
          >
            Login
          </a>

          <a
            routerLink="/register"
            style="color: white; text-decoration: none;"
          >
            Register
          </a>

        }
      </div>
    </nav>
  `
})
export class NavbarComponent {
  auth = inject(AuthService);
}