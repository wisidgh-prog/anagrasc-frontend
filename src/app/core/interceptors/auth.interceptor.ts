import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('anagrasc_token');
    if (token) {
      const headers: any = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
      const clone = req.clone({ setHeaders: headers });
      return next.handle(clone);
    }
    return next.handle(req);
  }
}
