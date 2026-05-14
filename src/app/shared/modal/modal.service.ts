import { Injectable } from '@angular/core';
import { ModalComponent } from './modal.component';

@Injectable({ providedIn: 'root' })
export class ModalService {

  private modal!: ModalComponent;
  // Register the modal component instance so services/components can
  // trigger modals without directly importing the component.
  register(modal: ModalComponent) {
    this.modal = modal;
  }

  // Show a simple alert modal (OK button)
  alert(title: string, message: string, variant: 'info'|'success'|'warning'|'danger' = 'info') {
    this.modal?.openAlert(title, message, variant);
  }

  // Show a confirmation modal. `onConfirm` is called when user confirms.
  confirm(title: string, message: string, onConfirm: () => void, variant: 'info'|'success'|'warning'|'danger' = 'info') {
    this.modal?.openConfirm(title, message, onConfirm, variant);
  }
}
    