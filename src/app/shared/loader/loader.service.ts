import { Injectable } from '@angular/core';
import { LoaderComponent } from './loader.component';

@Injectable({ providedIn: 'root' })
// LoaderService
// Controls the shared LoaderComponent instance. Components/services call
// `loaderService.show()` to display a loading overlay and `hide()` to remove it.
export class LoaderService {
  private loader?: LoaderComponent;

  register(loader: LoaderComponent) {
    this.loader = loader;
  }

  show(message: string = 'Loading...') {
    this.loader?.show(message);
  }

  hide() {
    this.loader?.hide();
  }
}
