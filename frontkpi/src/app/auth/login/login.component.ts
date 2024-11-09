import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          console.log('Login successful', response);
          localStorage.setItem('accessToken', response.accessToken); // Save the access token
          localStorage.setItem('userEmail', response.email);  // Save email
          localStorage.setItem('role', response.roles);  // Save roles
          this.router.navigate(['/dashboard']);  // Navigate to the dashboard
        },
        error => {
          console.error('Login error', error);
        }
      );
    }
  }
  
}
