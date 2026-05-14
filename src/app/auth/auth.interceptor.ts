import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('req: ', req);
      // return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401 || error.status === 403) {
          console.log('🔒 Unauthorized / Forbidden → logging out');

          //  Force logout
          localStorage.clear();

          //  Redirect to login
          this.router.navigate(['/login'], { 
            queryParams: {
              message: 'Authentication failed. Please login again.'
            }
          });
        }

        return throwError(() => error);
      })
    );
  }
}
