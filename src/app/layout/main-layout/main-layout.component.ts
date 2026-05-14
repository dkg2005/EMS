import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout-wrapper" [class.collapsed]="isCollapsed">
      <!-- Sidebar -->
      <aside class="sidebar glass">
        <div class="sidebar-header">
          <div class="logo">EMS</div>
          <button class="toggle-btn" (click)="toggleSidebar()">
            <i class="bi bi-list"></i>
          </button>
        </div>
        
        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <i class="bi bi-grid"></i>
            <span>Dashboard</span>
          </a>
          <a routerLink="/employees" routerLinkActive="active" class="nav-item">
            <i class="bi bi-people"></i>
            <span>Employees</span>
          </a>
          <a routerLink="/departments" routerLinkActive="active" class="nav-item">
            <i class="bi bi-building"></i>
            <span>Departments</span>
          </a>
          <a routerLink="/assets" routerLinkActive="active" class="nav-item">
            <i class="bi bi-pc-display"></i>
            <span>Assets</span>
          </a>
          <a routerLink="/employee-assets" routerLinkActive="active" class="nav-item">
             <i class="bi bi-person-badge"></i>
            <span>Assignments</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info" *ngIf="!isCollapsed">
            <div class="avatar">{{ userInitial }}</div>
            <div class="details">
              <span class="name">User</span>
              <span class="role">Admin</span>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()" title="Logout">
            <i class="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="top-bar glass">
            <div class="page-title">
                <!-- Can be dynamic based on route data -->
                Employee Management System
            </div>
            <div class="top-actions">
                <button class="icon-btn"><i class="bi bi-bell"></i></button>
                <button class="icon-btn"><i class="bi bi-gear"></i></button>
            </div>
        </header>

        <div class="content-area">
            <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }

    .layout-wrapper {
      display: flex;
      height: 100%;
      background: var(--bg-color);
    }

    /* Sidebar Styles */
    .sidebar {
      width: 260px;
      height: 100%;
      background: var(--surface-color);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 50;
    }

    .layout-wrapper.collapsed .sidebar {
      width: 80px;
    }

    .sidebar-header {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      white-space: nowrap;
    }

    .layout-wrapper.collapsed .logo {
      display: none;
    }

    .toggle-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1.5rem 0.75rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1rem;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--radius-md);
      transition: all 0.2s;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
    }

    .nav-item i {
      font-size: 1.25rem;
      min-width: 1.5rem;
      text-align: center;
    }

    .nav-item:hover {
      background: rgba(99, 102, 241, 0.05); /* slightly lighter primary */
      color: var(--primary-color);
    }

    .nav-item.active {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
      color: white;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        overflow: hidden;
    }

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        flex-shrink: 0;
    }

    .details {
        display: flex;
        flex-direction: column;
        white-space: nowrap;
    }

    .details .name {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text-main);
    }

    .details .role {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .logout-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: var(--radius-md);
        transition: all 0.2s;
    }
    
    .logout-btn:hover {
        background: #fee2e2;
        color: #ef4444;
    }

    .layout-wrapper.collapsed .sidebar-footer {
        justify-content: center;
    }
    
    .layout-wrapper.collapsed .user-info {
        display: none;
    }

    /* Main Styles */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    .top-bar {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      border-bottom: 1px solid var(--border-color);
      z-index: 40;
    }

    .page-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-main);
    }

    .top-actions {
        display: flex;
        gap: 0.75rem;
    }

    .icon-btn {
        background: none;
        border: 1px solid var(--border-color);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .icon-btn:hover {
        background: var(--surface-color);
        color: var(--primary-color);
        border-color: var(--primary-color);
    }

    .content-area {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
        .sidebar {
            position: absolute;
            left: -260px;
        }
        
        .layout-wrapper.collapsed .sidebar {
            left: 0;
            width: 260px; /* Expand fully when toggled on mobile */
        }

        .main-content {
            width: 100%;
        }
    }
  `]
})
export class MainLayoutComponent {
  isCollapsed = false;
  router = inject(Router);

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  get userInitial(): string {
    return 'U'; // Placeholder
  }
  
  logout() {
      localStorage.removeItem('empMgtUser');
      this.router.navigate(['/login']);
  }
}
