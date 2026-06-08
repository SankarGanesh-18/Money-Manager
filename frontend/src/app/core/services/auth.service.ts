import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = environment.apiUrl;

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private _token = signal<string | null>(
    localStorage.getItem(this.TOKEN_KEY)
  );

  private _user = signal<User | null>(
    this.loadUserFromStorage()
  );

  token = this._token.asReadonly();
  user = this._user.asReadonly();

  isAuthenticated = computed(() => !!this._token());

  private loadUserFromStorage(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  register(name: string, email: string, password: string) {
    return this.http.post<{
      success: boolean;
      data: {
        user: User;
        token: string;
      };
    }>(
      `${this.apiUrl}/auth/register`,
      { name, email, password }
    ).pipe(
      tap(res => this.persist(res.data.user, res.data.token))
    );
  }

  login(email: string, password: string) {
    return this.http.post<{
      success: boolean;
      data: {
        user: User;
        token: string;
      };
    }>(
      `${this.apiUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(res => this.persist(res.data.user, res.data.token))
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this._token.set(null);
    this._user.set(null);

    this.router.navigate(['/login']);
  }

  private persist(user: User, token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    this._token.set(token);
    this._user.set(user);
  }
}