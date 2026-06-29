import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  showMenu = false;

  constructor(
    public auth: AuthService
  ){}

  get initials(): string {

    const user = this.auth.user();

    if(!user){
      return '';
    }

    return (
      user.firstName.charAt(0) +
      user.lastName.charAt(0)
    ).toUpperCase();

  }

  toggleMenu(){

    this.showMenu = !this.showMenu;

  }

  logout(){

    this.showMenu = false;

    this.auth.logout();

  }

  @HostListener('document:click')
  closeMenu(){

    this.showMenu = false;

  }

  stop(event:MouseEvent){

    event.stopPropagation();

  }

}