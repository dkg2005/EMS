import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { ModalService } from '../../shared/modal/modal.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  imports: [CommonModule, FormsModule, LoaderComponent,HeaderComponent],
})
export class EmployeeComponent implements OnInit {
  employees: any[] = [];
  pagedEmployees: any[] = [];
  departments: any[] = [];
  deptMap: { [key: number]: string } = {};

  // Form state
  form: any = {
    id: null,
    name: '',
    email: '',
    password: '',
    phone: '',
    departmentId: null,
    dateOfJoining: '',
    status: 'ACTIVE'
  };

  // Search and Filter state
  activeSearchColumn: string | null = null;
  globalFilter = '';
  filters = {
    name: '',
    email: '',
    phone: '',
    department: '',
    doj: '',
    status: ''
  };

  errors: any = {};
  editing = false;

  // Pagination
  page = 1;
  pageSize = 5;
  entriesOptions = [5, 10, 20, 50];

  // Notifications
  notificationVisible = false;
  notificationMessage = '';
  notificationVariant: 'success' | 'error' = 'success';

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private modal: ModalService
  ) {}

  ngOnInit(): void {
    this.departmentService.getAll().subscribe((res: any) => {
      const data = res?.data || res || [];
      this.departments = data;
      data.forEach((d: any) => this.deptMap[d.id] = d.name);
      this.loadEmployees();
    });
  }

  loadEmployees() {
    this.employeeService.getAll().subscribe((res: any) => {
      this.employees = res?.data || res || [];
    });
  }

  getDeptName(id: number): string {
    return this.deptMap[id] || '-';
  }

  // ---------- Filtering Logic (Matches Department Style) ----------
  
  activateColumnSearch(column: string) {
    this.activeSearchColumn = column;
  }

  clearColumnSearch(column: string) {
    (this.filters as any)[column] = '';
    this.activeSearchColumn = null;
    this.page = 1;
  }

  onColumnSearch(column: string, event: any) {
    (this.filters as any)[column] = event.target.value;
    this.page = 1;
  }

  onGlobalFilterChange(v: string) {
    this.globalFilter = v.toLowerCase();
    this.page = 1;
  }

  get filteredEmployees() {
  return this.employees.filter((e) => {
    // 1. Column-specific matches
    const nameMatch = !this.filters.name || 
      e.name?.toLowerCase().includes(this.filters.name.toLowerCase());
      
    const emailMatch = !this.filters.email || 
      e.email?.toLowerCase().includes(this.filters.email.toLowerCase());
      
    const phoneMatch = !this.filters.phone || 
      (e.phone || '').toLowerCase().includes(this.filters.phone.toLowerCase());
      
    const deptMatch = !this.filters.department || 
      this.getDeptName(e.department_id).toLowerCase().includes(this.filters.department.toLowerCase());

    const statusMatch = !this.filters.status || 
      e.status?.toLowerCase().includes(this.filters.status.toLowerCase());

    // 2. Added DOJ match
    const dojMatch = !this.filters.doj || 
      (e.date_of_joining || '').toLowerCase().includes(this.filters.doj.toLowerCase());

    // 3. Global filter
    const gf = this.globalFilter.trim().toLowerCase();
    const globalMatch = !gf || JSON.stringify(e).toLowerCase().includes(gf);

    // All conditions must be true
    return nameMatch && emailMatch && phoneMatch && deptMatch && statusMatch && dojMatch && globalMatch;
  });
}

  // ---------- Pagination Logic (Matches Department Style) ----------

  get totalPages() {
    const total = Math.ceil(this.filteredEmployees.length / this.pageSize);
    return total > 0 ? total : 1;
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedEmployeesList() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  setPage(p: number) {
    this.page = p;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  onPageSizeChange(size: any) {
    this.pageSize = Number(size);
    this.page = 1;
  }

  // ---------- Form Actions ----------

  validate() {
    this.errors = {};
    if (!this.form.name) this.errors.name = 'Name is required';
    if (!this.form.email) this.errors.email = 'Email is required';
    if (!this.editing) {
      if (!this.form.password) this.errors.password = 'Password required';
      else if (this.form.password.length < 8) this.errors.password = 'Min 8 characters';
    }
    if (!this.form.departmentId) this.errors.departmentId = 'Select department';
    return Object.keys(this.errors).length === 0;
  }

  submit(f: NgForm) {
    if (!this.validate()) return;
    this.employeeService.save(this.form).subscribe((res: any) => {
      this.showNotification(this.editing ? 'Employee updated' : 'Employee created', 'success');
      this.reset();
      this.loadEmployees();
    });
  }

  edit(emp: any) {
    this.editing = true;
    this.form = { ...emp, departmentId: emp.department_id, dateOfJoining: emp.date_of_joining };
    // scroll form into view and focus first input for better UX on small screens
    try {
      const el = document.querySelector('.form-card');
      if (el && (el as HTMLElement).scrollIntoView) {
        (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setTimeout(() => {
        const input = document.querySelector('.form-card input, .form-card textarea') as HTMLElement | null;
        if (input && (input as HTMLElement).focus) (input as HTMLElement).focus();
      }, 300);
    } catch (e) {
      // ignore non-browser environment
    }
  }

  softDelete(emp: any) {
    this.modal.confirm('Confirm', 'Delete this employee?', () => {
      const dto = { ...emp, status: 'DELETED' };
      this.employeeService.save(dto).subscribe(() => {
        this.showNotification('Employee deleted', 'success');
        this.loadEmployees();
      });
    }, 'danger');
  }

  reset() {
    this.editing = false;
    this.form = { id: null, name: '', email: '', password: '', departmentId: null, dateOfJoining: '', status: 'ACTIVE' };
    this.errors = {};
  }

  showNotification(msg: string, variant: 'success' | 'error') {
    this.notificationMessage = msg;
    this.notificationVariant = variant;
    this.notificationVisible = true;
    setTimeout(() => (this.notificationVisible = false), 2000);
  }
}