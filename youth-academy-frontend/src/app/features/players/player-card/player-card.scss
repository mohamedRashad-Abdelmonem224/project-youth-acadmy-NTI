import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-auth-gate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-gate.html',
  styleUrl: './auth-gate.scss',
})
export class AuthGate {
  mode = signal<'login' | 'register'>('login');
  loading = signal(false);
  errorMsg = signal('');

  // login model
  loginUsername = '';
  loginPassword = '';

  // register model
  regName = '';
  regUsername = '';
  regEmail = '';
  regPassword = '';
  regRole: UserRole = 'player';

  constructor(private auth: AuthService) {}

  switchMode(mode: 'login' | 'register') {
    this.mode.set(mode);
    this.errorMsg.set('');
  }

  submitLogin() {
  
    if (!this.loginUsername || !this.loginPassword) {
      this.errorMsg.set('Please enter your username and password');
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');
    
    this.auth
      .login({ 
       
        username: this.loginUsername, 
        password: this.loginPassword 
      })
      .subscribe({
        next: () => this.loading.set(false),
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.errorMsg.set(err.error?.message || 'Login data is incorrect');
        },
      });
  }

  submitRegister() {
    if (!this.regName || !this.regUsername || !this.regEmail || !this.regPassword) {
      this.errorMsg.set('Please fill all fields');
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');
    this.auth
      .register({
        name: this.regName,
        username: this.regUsername,
        email: this.regEmail,
        password: this.regPassword,
        role: this.regRole,
      })
      .subscribe({
        next: () => this.loading.set(false),
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.errorMsg.set(err.error?.message || ' error during registration');
        },
      });
  }
}
