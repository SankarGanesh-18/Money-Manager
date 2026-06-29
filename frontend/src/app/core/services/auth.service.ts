import { Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  apiUrl = 'http://localhost:5000/api/users';

  user = signal<User | null>(

    JSON.parse(
      localStorage.getItem('user') || 'null'
    )

  );

  token = signal<string>(

    localStorage.getItem('token') || ''

  );

  constructor(

    private http: HttpClient,

    private router: Router

  ){}

  register(data: User){

    return this.http.post<any>(

      `${this.apiUrl}/register`,

      data

    );

  }

  login(data:any){

    return this.http.post<any>(

      `${this.apiUrl}/login`,

      data

    );

  }

  saveUser(user:User,token:string){

    localStorage.setItem(

      'user',

      JSON.stringify(user)

    );

    localStorage.setItem(

      'token',

      token

    );

    this.user.set(user);

    this.token.set(token);

  }

  logout(){

    localStorage.clear();

    this.user.set(null);

    this.token.set('');

    this.router.navigate(['/login']);

  }

  isLoggedIn(){

    return this.token() !== '';

  }

}