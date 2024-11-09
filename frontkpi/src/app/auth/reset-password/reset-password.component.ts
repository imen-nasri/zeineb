import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token!: string; // Use definite assignment assertion

  constructor(private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token')!; // Get token from route
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(this.token, this.resetPasswordForm.value.newPassword).subscribe(
        response => {
          console.log('Password reset successful', response);
        },
        error => {
          console.error('Error resetting password', error);
        }
      );
    }
  }
}
