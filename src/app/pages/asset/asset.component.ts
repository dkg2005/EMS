import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../models/asset';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { LoaderService } from '../../shared/loader/loader.service';
import { ModalService } from '../../shared/modal/modal.service';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-asset',
  imports: [CommonModule, FormsModule, LoaderComponent,HeaderComponent],
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
})
export class AssetComponent implements OnInit {
  @ViewChild('entriesSelect') entriesSelect: any;
  editing = false;
  activeSearchColumn: string | null = null;

  // Form State & Errors
  form: Asset = {
    id: null,
    name: '',
    code: '',
    status: 'AVAILABLE',
    description: '',
  };
  errors = { name: '', code: '', description: '' };

  // Data
  assets: Asset[] = [];
  filters = { name: '', code: '', description: '', status: '' };
  globalFilter = '';

  // Pagination
  page = 1;
  pageSize = 5;
  entriesOptions = [5, 10, 15, 25];

  // Notifications
  notificationMessage = '';
  notificationVariant: 'info' | 'success' | 'warning' | 'danger' = 'success';
  notificationVisible = false;
  private _notificationTimer: any = null;

  constructor(
    private assetService: AssetService,
    private loader: LoaderService,
    private modal: ModalService
  ) {}

  ngOnInit(): void {
    console.log('AssetComponent initialized');
    this.load();
  }

  showNotification(
    message: string,
    variant: 'info' | 'success' | 'warning' | 'danger' = 'success',
    timeout = 3000
  ) {
    this.notificationMessage = message;
    this.notificationVariant = variant;
    this.notificationVisible = true;
    if (this._notificationTimer) clearTimeout(this._notificationTimer);
    this._notificationTimer = setTimeout(() => {
      this.notificationVisible = false;
      this._notificationTimer = null;
    }, timeout);
  }
  
openEntries() {
  const el = this.entriesSelect?.nativeElement || this.entriesSelect;

  if (el?.showPicker) {
    el.showPicker();          // modern browsers
  } else {
    el.focus();               // fallback
    el.click();
  }
}


  load() {
    this.loader.show('Loading assets...');
    this.assetService.getAll().subscribe({
      next: (res) => {
        this.assets = res;
        this.loader.hide();
      },
      error: () => {
        this.loader.hide();
        this.modal.alert('Error', 'Could not load assets');
      },
    });
  }

  validateForm(): boolean {
    let isValid = true;
    this.errors = { name: '', code: '', description: '' };

    if (!this.form.name?.trim()) {
      this.errors.name = 'Asset name is required';
      isValid = false;
    } else if (this.form.name.length > 50) {
      this.errors.name = 'Name cannot exceed 50 characters';
      isValid = false;
    }

    if (!this.form.code?.trim()) {
      this.errors.code = 'Asset code is required';
      isValid = false;
    }

    if (this.form.description) {
      const words = this.form.description.trim().split(/\s+/);
      const wordCount = words[0] === '' ? 0 : words.length;
      if (wordCount > 100) {
        this.errors.description = `Description cannot exceed 100 words (currently ${wordCount} words)`;
        isValid = false;                                                            
      }
    }
    return isValid;
  }

  submit(f: NgForm) {
    if (this.validateForm()) {
      this.save(f);
    }
  }

  save(formRef: any) {
    this.loader.show(this.form.id ? 'Updating asset...' : 'Creating asset...');

    this.assetService.save(this.form).subscribe({
      next: (res: any) => {
        this.loader.hide();

        // If backend sends structured response
        if (res?.success === false) {
          // this.showNotification(res.message);
          this.modal.alert('Error', res.message || 'Could not save asset');
          return;
        }

        this.showNotification(
          this.form.id
            ? 'Asset updated successfully'
            : 'Asset created successfully',
          'success'
        );

        this.reset();
        this.load();
      },

      error: (err) => {
        this.loader.hide();

        // Extract backend message if available
        const msg =
          err?.error?.message ||
          err?.error ||
          (err.status === 409
            ? 'Asset code already exists'
            : 'Something went wrong. Please try again.');

        this.modal.alert('Error', msg);
      },
    });
  }

  softDelete(a: Asset) {
    this.modal.confirm(
      'Delete Asset',
      `Are you sure you want to delete "${a.name}"?`,
      () => {
        this.loader.show('Deleting asset...');
        a.status = 'DELETED';
        this.assetService.save(a).subscribe({
          next: () => {
            this.loader.hide();
            this.load();
            this.showNotification('Asset Deleted Sucessfully', 'success');
          },
          error: () => {
            this.loader.hide();
            this.showNotification('Could not delete asset', 'danger');
          },
        });
      },
      'danger'
    );
  }

  edit(a: Asset) {
    this.editing = true;
    this.form = { ...a };
    // scroll the form into view on small screens so user sees the edit form
    try {
      const el = document.querySelector('.form-card');
      if (el && (el as HTMLElement).scrollIntoView) {
        (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // focus first input in the form if available
      setTimeout(() => {
        const input = document.querySelector('.form-card input, .form-card textarea') as HTMLElement | null;
        if (input && (input as HTMLElement).focus) {
          (input as HTMLElement).focus();
        }
      }, 300);
    } catch (e) {
      // ignore in non-browser environments
    }
  }

  reset() {
    this.editing = false;
    this.form = {
      id: null,
      name: '',
      code: '',
      status: 'AVAILABLE',
      description: '',
    };
    this.errors = { name: '', code: '', description: '' };
  }

  // --- Filtering & Pagination Logic ---
  get filteredAssets() {
    return this.assets.filter((a) => {
      const matchName =
        !this.filters.name ||
        a.name?.toLowerCase().includes(this.filters.name.toLowerCase());
      const matchCode =
        !this.filters.code ||
        a.code?.toLowerCase().includes(this.filters.code.toLowerCase());
      const matchStatus =
        !this.filters.status ||
        a.status?.toLowerCase().includes(this.filters.status.toLowerCase());

      const gf = (this.globalFilter || '').toLowerCase().trim();
      const matchGlobal =
        !gf ||
        (a.name || '').toLowerCase().includes(gf) ||
        (a.code || '').toLowerCase().includes(gf) ||
        (a.description || '').toLowerCase().includes(gf);
      return matchName && matchCode && matchStatus && matchGlobal;
    });
  }

  get totalPages() {
    return Math.ceil(this.filteredAssets.length / this.pageSize) || 1;
  }

  get pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedAssets() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredAssets.slice(start, start + this.pageSize);
  }

  setPage(n: number) {
    this.page = n;
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

  activateColumnSearch(col: string) {
    this.activeSearchColumn = col;
  }
  onColumnSearch(col: string, event: any) {
    (this.filters as any)[col] = event.target.value;
    this.page = 1;
  }
  clearColumnSearch(col: string) {
    (this.filters as any)[col] = '';
    this.activeSearchColumn = null;
  }
  onGlobalFilterChange(val: string) {
    this.globalFilter = val;
    this.page = 1;
  }
}
