// App root component
// This file defines the top-level Angular component that bootstraps the application.
// A beginner should know: the component decorator links the template and styles,
// and this class hosts app-wide logic (here it's minimal).
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from "./shared/modal/modal.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'employee_management';
}
