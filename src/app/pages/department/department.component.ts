import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../shared/modal/modal.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
  imports: [FormsModule, CommonModule, LoaderComponent, HeaderComponent],
})
// Component for managing departments (create, update, delete, list)
// Beginners: this component coordinates form state, API calls via `DepartmentService`,
// and controls UI elements like loader, toast notifications and the department table.
export class DepartmentComponent implements OnInit {
  
  editing: boolean = false;

  activeSearchColumn: string | null = null;

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
  }

  onGlobalFilterChange(value: string) {
    this.globalFilter = value;
    this.page = 1;
  }

  //  removed alertMessage + alertType (modal will handle UI)
  errors = { name: '', size: '', description: ''};

  form: any = {
    id: null,
    name: '',
    size: '',
    status: 'ACTIVE',
    description: ''
  };

  filters = {
    name: '',
    description: '',
    size: '',
    status: ''
  };

  // global search across columns
  globalFilter: string = '';

  departments: any[] = [];
  pagedData: any[] = [];
  page = 1;
  pageSize = 5;
  totalItems = 0;

   // options for entries per page
  entriesOptions = [5, 10, 15, 25];

  constructor(  // dependency injection of services
    private deptService: DepartmentService,
    private modal: ModalService,    // <-- existing
    private loader: LoaderService
  ) {}

  // inject loader service
  // (we add the parameter below via assignment to keep minimal changes to constructor formatting)

  // transient notification (non-modal) shown for create/update
  notificationMessage: string = '';
  notificationVariant: 'info'|'success'|'warning'|'danger' = 'success';
  notificationVisible: boolean = false;
  private _notificationTimer: any = null;

  showNotification(message: string, variant: 'info'|'success'|'warning'|'danger' = 'success', timeout = 3000) {
    this.notificationMessage = message;
    this.notificationVariant = variant;
    this.notificationVisible = true;
    if (this._notificationTimer) {
      clearTimeout(this._notificationTimer);
    }
    this._notificationTimer = setTimeout(() => {
      this.notificationVisible = false;
      this._notificationTimer = null;
    }, timeout);
  }

  validateForm(): boolean {
  let isValid = true;
  this.errors = { name: '', size: '', description: '' }; // Clear previous errors

  // Name Validation: Required and Max 50 chars
  if (!this.form.name || this.form.name.trim() === '') {
    this.errors.name = 'Department name is required';
    isValid = false;
  } else if (this.form.name.length > 50) {
    this.errors.name = 'Name cannot exceed 50 characters';
    isValid = false;
  }

  // Size Validation: Required, > 0, and <= 1000
  if (this.form.size === null || this.form.size === undefined) {
    this.errors.size = 'Size is required';
    isValid = false;
  } else if (this.form.size <= 0) {
    this.errors.size = 'Size must be greater than 0';
    isValid = false;
  } else if (this.form.size > 1000) {
    this.errors.size = 'Size cannot exceed 1000';
    isValid = false;
  }

  // --- DESCRIPTION WORD COUNT VALIDATION ---
  if (this.form.description) {
    // Trim and split by whitespace (spaces, tabs, newlines)
    const words = this.form.description.trim().split(/\s+/);
    const wordCount = words[0] === "" ? 0 : words.length;

    if (wordCount > 100) {
      this.errors.description = `Description cannot exceed 100 words (currently ${wordCount} words)`;
      isValid = false;
    }
  }

  return isValid;
}

  submit(f: any) {
    if (this.validateForm()) {
      // Logic to save the department
      console.log('Form Submitted Successfully', this.form);
      this.save(f);
    }
  }

  ngOnInit(): void {
    this.load();
  }
  

  load() {
    // console.log("LOADING DEPARTMENTS");
    this.loader.show('Loading departments...');
    this.deptService.getAll().subscribe({
      next: (res) => {
        this.departments = res;
        // console.log("DEPARTMENTS LOADED", this.departments);
        this.loader.hide();
      },
      error: () => {
        this.loader.hide();
        this.modal.alert('Error', 'Could not load departments');
      }
    });
  }

  save(formRef: any) {

    if (!formRef.valid) return;
    this.loader.show(this.form.id ? 'Updating department...' : 'Creating department...');

    this.deptService.save(this.form).subscribe({
      next: (res) => {

        if (res.success) {

          const wasUpdate = !!this.form?.id;
          this.reset();
          this.loader.hide();
          this.load();

          // show transient notification instead of modal for create/update
          const msg = res.message || (wasUpdate ? 'Department updated' : 'Department created');
          this.showNotification(msg, 'success');

        } else {
          //  BACKEND VALIDATION ERROR MODAL
          this.loader.hide();
          this.modal.alert(
            'Validation Error',
            res.message || 'Please check your inputs'
          );
        }
      },

      error: () => {
        //  SERVER ERROR MODAL
        this.loader.hide();
        this.modal.alert(
          'Error',
          'Something went wrong. Please try again.'
        );
      }
    });
  }

  softDelete(d: any) {
    console.log("DELETE CLICKED", d);
  this.modal.confirm(
    'Delete Department',
    `Are you sure you want to delete "${d.name}" ?`,
    () => {   // <--  this is the onConfirm callback

      d.status = 'DELETED';
      this.loader.show('Deleting department...');

      this.deptService.save(d).subscribe({
        next: () => {
          this.loader.hide();
          this.load();
          this.showNotification('Department deleted', 'success');
        },
        error: () => {
          this.loader.hide();
          this.showNotification('Could not delete department', 'danger');
        }
      });

    }, 'danger'
  );
}


  edit(d: any) {
    this.editing = true;
    this.form = { ...d };
    // scroll form into view and focus first input for small screens
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
      // ignore
    }
  }

  reset() {
    this.editing = false;
    this.form = { id: null, name: '', size: '', status: 'ACTIVE', description: '' };
    this.errors = { name: '', size: '',description: '' };
  }

  get filteredDepartments() {
    return this.departments.filter(d => {

      const matchName =
        !this.filters.name ||
        d.name?.toLowerCase().includes(this.filters.name.toLowerCase());

      const matchDescription =
        !this.filters.description ||
        (d.description || '').toLowerCase().includes(this.filters.description.toLowerCase());

      const matchSize =
        !this.filters.size ||
        String(d.size) === String(this.filters.size);

      const matchStatus =
        !this.filters.status ||
        d.status?.toLowerCase().includes(this.filters.status.toLowerCase());

      // apply global filter across a few columns
      const gf = (this.globalFilter || '').toString().trim().toLowerCase();
      const matchGlobal = !gf || (
        (d.name || '').toString().toLowerCase().includes(gf) ||
        ((d.description || '') || '').toString().toLowerCase().includes(gf) ||
        String(d.size).toLowerCase().includes(gf) ||
        ((d.status || '')).toString().toLowerCase().includes(gf)
      );

      return matchName && matchDescription && matchSize && matchStatus && matchGlobal;
    });
  }

   // pagination helpers
  get totalPages() {
    const total = Math.ceil(this.filteredDepartments.length / this.pageSize);
    return total > 0 ? total : 1;
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedDepartments() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredDepartments.slice(start, start + this.pageSize);
  }

  setPage(n: number) {
    if (n < 1) n = 1;
    if (n > this.totalPages) n = this.totalPages;
    this.page = n;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  onPageSizeChange(size: number | string) {
    this.pageSize = Number(size);
    this.page = 1;
  }
}
