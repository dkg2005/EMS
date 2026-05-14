import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeAssetService } from '../../services/employeeAsset.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { LoaderService } from '../../shared/loader/loader.service';
import { ModalService } from '../../shared/modal/modal.service';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-employee-asset',
  imports: [CommonModule, FormsModule, LoaderComponent, HeaderComponent],
  templateUrl: './employeeAsset.component.html',
  styleUrls: ['./employeeAsset.component.scss'],
})
export class EmployeeAssetComponent implements OnInit {
  Math = Math;

  /* ================= DATA ================= */
  mappings: any[] = [];
  filteredMappings: any[] = [];
  pagedMappings: any[] = [];

  employees: any[] = [];
  assets: any[] = [];

  selectedEmployees: any[] = [];
  selectedAssets: any[] = [];

  /* ================= Search filters ================= */

  activeSearchColumn: string | null = null;
  filters = {
    employee: '',
    asset: '',
  };

  /* ================= DROPDOWNS ================= */
  empDropdownOpen = false;
  assetDropdownOpen = false;
  empSearchText = '';
  assetSearchText = '';

  /* ================= TABLE / PAGINATION (same pattern as Employee) ================= */
  searchText = '';
  globalFilter = '';
  page = 1;
  pageSize = 5;
  entriesOptions: number[] = [5, 10, 20, 50];

  totalPages = 1;
  totalItems = 0;
  pageNumbers: number[] = [];

  /* ================= NOTIFICATIONS ================= */
  notificationVisible = false;
  notificationMessage = '';
  notificationVariant = 'success';

  editing: boolean = false;
  selectedMappingId: number | null = null;

  @ViewChild('empSearchInput') empSearchInput!: ElementRef;
  @ViewChild('assetSearchInput') assetSearchInput!: ElementRef;

  constructor(
    private service: EmployeeAssetService,
    private loader: LoaderService,
    private modal: ModalService
  ) {}

  ngOnInit(): void {
    this.loadDropdowns();
    this.loadMappings();
  }

  /* ================= LOAD DATA ================= */
  loadDropdowns() {
    this.service.getEmployees().subscribe((res) => (this.employees = res));
    this.service.getAssets().subscribe((res) => (this.assets = res));
  }

  loadMappings() {
    this.loader.show();
    this.service.getAll().subscribe({
      next: (data) => {
        this.mappings = data.map((row) => {
          let parsedAssets: any[] = [];
          try {
            parsedAssets =
              typeof row.assets === 'string'
                ? JSON.parse(row.assets)
                : row.assets;
          } catch {
            parsedAssets = [];
          }
          return { ...row, assetList: parsedAssets };
        });

        this.applyFilters();
        this.loader.hide();
      },
      error: () => this.loader.hide(),
    });
  }

  filterData() {
    const txt = this.searchText.toLowerCase();
    this.filteredMappings = this.mappings.filter((item) => {
      const matchName = item.name.toLowerCase().includes(txt);
      const matchAsset = item.assetList.some((a: any) =>
        (a.code || '').toLowerCase().includes(txt)
      );
      return matchName || matchAsset;
    });

    this.totalItems = this.filteredMappings.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.setPage(1);
  }

  /* ================= FORM SUBMIT ================= */
  submit() {
    if (
      this.selectedEmployees.length === 0 ||
      this.selectedAssets.length === 0
    ) {
      this.showNotification(
        'Please select at least one Employee and one Asset',
        'warning'
      );
      return;
    }

    const payload = {
      employeeIds: this.selectedEmployees.map((e) => e.id),
      assetIds: this.selectedAssets.map((a) => a.id),
      flag: this.editing ? 'UPDATE' : 'CREATE',
    };

    this.loader.show();
    this.service.save(payload).subscribe({
      next: () => {
        this.showNotification(
          this.editing
            ? 'Mapping updated successfully'
            : 'Assets mapped successfully',
          'success'
        );
        this.resetForm();
        this.loadMappings();
        this.loader.hide();
      },
      error: () => {
        this.showNotification('Failed to save mapping', 'danger');
        this.loader.hide();
      },
    });
  }

  deleteMapping(row: any) {
    this.modal.confirm(
      'Confirm Delete',
      `Are you sure you want to remove assets for ${row.name}?`,
      () => {
        // User clicked CONFIRM
        console.log('Deleting mapping for employee ID:', row.employee_id);
        this.loader.show();

        this.service.deleteByEmployee(row.employee_id).subscribe({
          next: () => {
            this.showNotification('Mapping deleted', 'success');
            this.loadMappings();
            this.loader.hide();
          },
          error: () => {
            this.showNotification('Delete failed', 'danger');
            this.loader.hide();
          },
        });
      }, 'danger'
    );
  }

  edit(row: any) {
    this.editing = true;
    this.selectedMappingId = row.employee_id;
    const emp = this.employees.find((e) => e.id === row.employee_id);
    if (emp) this.selectedEmployees = [emp];

    if (row.assetList?.length) {
      const ids = row.assetList.map((a: any) => a.id);
      this.selectedAssets = this.assets.filter((a) => ids.includes(a.id));
    }

    // Scroll the mapping form into view and focus a control for mobile users
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

  /* ================= DROPDOWN HELPERS ================= */
  resetForm() {
    this.selectedEmployees = [];
    this.selectedAssets = [];
    this.empSearchText = '';
    this.assetSearchText = '';
    this.editing = false;
    this.selectedMappingId = null;
  }

  toggleEmpDropdown() {
    this.empDropdownOpen = !this.empDropdownOpen;
    this.assetDropdownOpen = false;
    if (this.empDropdownOpen)
      setTimeout(() => this.empSearchInput.nativeElement.focus(), 0);
  }

  filteredEmployees() {
    return this.employees.filter(
      (e) =>
        e.name.toLowerCase().includes(this.empSearchText.toLowerCase()) &&
        !this.selectedEmployees.find((sel) => sel.id === e.id)
    );
  }

  selectEmployee(e: any) {
    this.selectedEmployees.push(e);
  }

  removeEmployee(e: any) {
    this.selectedEmployees = this.selectedEmployees.filter(
      (sel) => sel.id !== e.id
    );
  }

  toggleAssetDropdown() {
    this.assetDropdownOpen = !this.assetDropdownOpen;
    this.empDropdownOpen = false;
    if (this.assetDropdownOpen)
      setTimeout(() => this.assetSearchInput.nativeElement.focus(), 0);
  }

  filteredAssets() {
    return this.assets.filter(
      (a) =>
        (a.name || a.code)
          .toLowerCase()
          .includes(this.assetSearchText.toLowerCase()) &&
        !this.selectedAssets.find((sel) => sel.id === a.id)
    );
  }

  selectAsset(a: any) {
    this.selectedAssets.push(a);
  }

  removeAsset(a: any) {
    this.selectedAssets = this.selectedAssets.filter((sel) => sel.id !== a.id);
  }

  /* ================= TABLE FILTERS (same idea as Employee) ================= */
  onGlobalFilterChange(value: string) {
    this.globalFilter = value;
    this.applyFilters();
  }

  applyFilters() {
    const global = this.globalFilter.toLowerCase();
    const emp = this.filters.employee.toLowerCase();
    const asset = this.filters.asset.toLowerCase();

    this.filteredMappings = this.mappings.filter((item) => {
      // employee name text
      const matchEmployee = !emp || item.name?.toLowerCase().includes(emp);

      // asset list text (code or name)
      const matchAsset =
        !asset ||
        item.assetList?.some((a: any) =>
          (a.code || a.name || '').toLowerCase().includes(asset)
        );

      // global search (already exists)
      const matchGlobal =
        !global || JSON.stringify(item).toLowerCase().includes(global);

      return matchEmployee && matchAsset && matchGlobal;
    });

    this.totalItems = this.filteredMappings.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.setPage(1);
  }

  activateColumnSearch(column: string) {
    this.activeSearchColumn = column;
  }

  onColumnSearch(column: string, event: any) {
    const value = event.target.value.toLowerCase();
    this.filters[column as 'employee' | 'asset'] = value;
    this.applyFilters();
  }

  clearColumnSearch(column: string) {
    this.filters[column as 'employee' | 'asset'] = '';
    this.activeSearchColumn = null;
    this.applyFilters();
  }

  setPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    const start = (this.page - 1) * this.pageSize;
    this.pagedMappings = this.filteredMappings.slice(
      start,
      start + this.pageSize
    );
  }

  onPageSizeChange(val: any) {
    this.pageSize = Number(val);
    this.applyFilters();
  }

  /* ================= UI UTIL ================= */
  showNotification(msg: string, variant: string) {
    this.notificationMessage = msg;
    this.notificationVariant = variant;
    this.notificationVisible = true;
    setTimeout(() => (this.notificationVisible = false), 3000);
  }

  closeDropdowns() {
    this.empDropdownOpen = false;
    this.assetDropdownOpen = false;
  }
}
