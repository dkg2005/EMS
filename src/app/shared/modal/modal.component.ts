import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class ModalComponent implements OnInit {

  // Modal state - this component is a shared modal used by ModalService.
  // Beginners: the ModalService registers this component and then calls
  // `openAlert()` or `openConfirm()` to show the modal from anywhere.
  visible = false;
  type: 'alert' | 'confirm' = 'alert';
  title = '';
  message = '';
  onConfirm: () => void = () => {};
  variant: 'info'|'success'|'warning'|'danger' = 'info';

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    // ⭐ VERY IMPORTANT — register this modal instance
    this.modalService.register(this);
  }

  openAlert(title: string, message: string, variant: 'info'|'success'|'warning'|'danger' = 'info') {
    this.visible = true;
    this.type = 'alert';
    this.title = title;
    this.message = message;
    this.variant = variant;
  }

  openConfirm(title: string, message: string, onConfirm: () => void, variant: 'info'|'success'|'warning'|'danger' = 'info') {
    this.visible = true;
    this.type = 'confirm';
    this.title = title;
    this.message = message;
    this.onConfirm = onConfirm;
    this.variant = variant;
  }

  close() {
    this.visible = false;
  }

  confirm() {
    this.onConfirm();
    this.close();
  }
}
