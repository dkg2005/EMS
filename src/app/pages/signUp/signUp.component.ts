import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signUp.component.html',
  styleUrls: ['./signUp.component.scss'],
})
export class SignupComponent implements OnInit {
  signupData = {
    name: '',
    email: '',
    password: '',
    departmentId: '',
  };

  departments: any[] = [];
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }
  loadDepartments() {
    this.http.get<any[]>('http://localhost:8080/api/department/get').subscribe({
      next: (res) => {
        this.departments = res;
      },
      error: (err) => {
        console.error('Department API error', err);
        this.departments = [];
      },
    });
  }

  signup() {
    // 1. Basic Validation Check
  if (!this.signupData.name.trim()) {
    this.errorMessage = 'Please enter your name.';
    return;
  }
  
  if (!this.signupData.email.trim() || !this.signupData.email.includes('@')) {
    this.errorMessage = 'Please enter a valid email address.';
    return;
  }

  if (this.signupData.password.length < 6) {
    this.errorMessage = 'Password must be at least 6 characters long.';
    return;
  }

  if (!this.signupData.departmentId) {
    this.errorMessage = 'Please select a department.';
    return;
  }
    this.loading = true;

    this.authService.signup(this.signupData).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = res.message;
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Signup failed. Please try again.';
        this.loading = false;
      },
    });
  }
}
