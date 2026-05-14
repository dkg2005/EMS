import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { AuthService } from '../../auth/auth.service';
import { DepartmentService } from '../../services/department.service';
import { EmployeeService } from '../../services/employee.service';
import { AssetService } from '../../services/asset.service';
import { EmployeeAssetService } from '../../services/employeeAsset.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  now = new Date();

  // Dashboard Stats Configuration
  stats = [
    {
      title: 'Departments',
      value: '0',
      icon: 'bi-building',
      link: '/departments',
      bgClass: 'bg-department'
    },
    {
      title: 'Employees',
      value: '0',
      icon: 'bi-people',
      link: '/employees',
      bgClass: 'bg-employees'
    },
    {
      title: 'Assets',
      value: '0',
      icon: 'bi-pc-display',
      link: '/assets',
      bgClass: 'bg-assets'
    },
    {
      title: 'Assignments',
      value: '0',
      icon: 'bi-person-badge',
      link: '/employee-assets',
      bgClass: 'bg-assignments'
    }
  ];

  constructor(
    private authService: AuthService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private assetService: AssetService,
    private employeeAssetService: EmployeeAssetService
  ) { }

  ngOnInit() {
    console.log("Dashboard Loaded for user:", this.user?.email);
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Fetch all data in parallel using forkJoin
    forkJoin({
      departments: this.departmentService.getAll(),
      employees: this.employeeService.getAll(),
      assets: this.assetService.getAll(),
      assignments: this.employeeAssetService.getAll()
    }).subscribe({
      next: (data) => {
        // Update stats with real counts
        this.stats[0].value = data.departments?.length?.toString() || '0';
        this.stats[1].value = data.employees?.length?.toString() || '0';
        this.stats[2].value = data.assets?.length?.toString() || '0';
        this.stats[3].value = data.assignments?.length?.toString() || '0';

        console.log('Dashboard data loaded:', data);
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        // Keep default values (0) on error
      }
    });
  }

  get user() {
    return this.authService.getCurrentUser();
  }
}