import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Sign in to your account</h2>
        </div>

        <div class="login-content">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-field">
              <label for="username">Username</label>
              <input
                id="username"
                type="text"
                formControlName="username"
                placeholder="Enter username"
                class="form-input">
              <div class="error" *ngIf="loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched">
                Username is required
              </div>
            </div>

            <div class="form-field">
              <label for="password">Password</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                placeholder="Enter password"
                class="form-input">
              <div class="error" *ngIf="loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched">
                Password is required
              </div>
            </div>

            <button
              type="submit"
              class="submit-btn"
              [disabled]="loginForm.invalid || isLoading">
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </form>

  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      background: var(--bg);
      padding: 24px;
    }
    
    .login-card {
      width: 100%;
      max-width: 340px;
      background: var(--panel-2);
      border: 1px solid var(--border);
      border-radius: 6px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    }
    
    .login-header {
      padding: 20px 20px 4px 20px;
      text-align: center;
      color: var(--text);
    }
    
    .login-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--text);
    }
    
    .login-content {
      padding: 20px;
    }

    .form-field {
      margin-bottom: 20px;
    }

    .form-field label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: var(--text);
    }

    .form-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      box-sizing: border-box;
      background: #0d1117;
      color: var(--text);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--brand);
      box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.3);
    }

    .error {
      color: #f85149; /* GitHub danger */
      font-size: 14px;
      margin-top: 4px;
    }

    .submit-btn {
      width: 100%;
      padding: 10px 12px;
      background: #238636; /* GitHub green */
      color: #ffffff;
      border: 1px solid #2ea043;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .submit-btn:hover:not(:disabled) {
      background: #2ea043;
      border-color: #3fb950;
    }

    .submit-btn:disabled {
      background: #26303c;
      border-color: var(--border);
      cursor: not-allowed;
    }

    .demo-credentials {
      margin-top: 16px;
      padding: 12px;
      background-color: #0d1117;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 13px;
      color: var(--muted);
    }

    .demo-credentials p {
      margin: 4px 0;
    }
  `]
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          alert('Login failed. Please try again.');
        }
      });
    }
  }
}
