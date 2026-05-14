import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute  } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
  };

  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.router.navigate(['/dashboard']);
  }

  login() {
    this.errorMessage = '';
    this.loading = true;

    console.log('Login is called', this.loginData);

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        console.log('Login response:', res);

        if (res.success) {
          // Save token & user
          this.authService.setUserFromResponse(res);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = res.message;
        }

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Something went wrong. Please try again.';
        this.loading = false;
      },
    });
  }
}
