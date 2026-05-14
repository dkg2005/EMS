import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class LoaderComponent implements OnInit {
  // A simple shared loader component.
  // It registers with `LoaderService` so any component/service can call
  // `loaderService.show()` / `loaderService.hide()` to control the loader.
  visible = false;
  message = 'Loading...';

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.register(this);
  }

  show(message: string = 'Loading...') {
    this.message = message;
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
