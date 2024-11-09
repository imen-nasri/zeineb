import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('role');

    // Check if the role is admin
    if (role === 'admin') {
      return true;
    } else {
      // Redirect to unauthorized page or home if not admin
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}