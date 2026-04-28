import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<any>(
    this.getUserFromStorage()
  );
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private getUserFromStorage(): any {
    const u = localStorage.getItem('anagrasc_user');
    return u ? JSON.parse(u) : null;
  }

  get currentUser(): any { return this.currentUserSubject.value; }
  get estConnecte(): boolean { return !!localStorage.getItem('anagrasc_token'); }
  get role(): string { return this.currentUser?.role ?? ''; }

  login(telephone: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { telephone, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('anagrasc_token', res.token);
        localStorage.setItem('anagrasc_user', JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
    localStorage.removeItem('anagrasc_token');
    localStorage.removeItem('anagrasc_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/connexion']);
  }

  getToken(): string | null { return localStorage.getItem('anagrasc_token'); }
}
