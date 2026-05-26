import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private url = environment.apiUrl;
  constructor(private http: HttpClient) {}

  private toParams(filtres: any): HttpParams {
    let p = new HttpParams();
    Object.keys(filtres).forEach(k => { if (filtres[k]) p = p.set(k, filtres[k]); });
    return p;
  }

  // ── AUTH ──────────────────────────────────────────
  inscrire(fd: FormData): Observable<any>            { return this.http.post(`${this.url}/register`, fd); }
  profil(): Observable<any>                          { return this.http.get(`${this.url}/me`); }

  // ── CATALOGUE PUBLIC ────────────────────────────
  getBiens(f: any = {}): Observable<any>             { return this.http.get(`${this.url}/biens`, { params: this.toParams(f) }); }
  getBien(id: number): Observable<any>               { return this.http.get(`${this.url}/biens/${id}`); }
  getCategories(): Observable<any>                   { return this.http.get(`${this.url}/categories`); }
  getSession(id: number): Observable<any>            { return this.http.get(`${this.url}/sessions/${id}`); }
  getOffres(sid: number): Observable<any>            { return this.http.get(`${this.url}/sessions/${sid}/offres`); }
  getVentesPassees(f: any = {}): Observable<any>     { return this.http.get(`${this.url}/ventes-passees`, { params: this.toParams(f) }); }

  // ── WALLET ENCHÉRISSEUR ────────────────────────
  getWallet(): Observable<any>                       { return this.http.get(`${this.url}/wallet`); }
  getTransactions(): Observable<any>                 { return this.http.get(`${this.url}/wallet/transactions`); }
  deposerWallet(d: any): Observable<any>             { return this.http.post(`${this.url}/wallet/deposer`, d); }
  getMesCautions(): Observable<any>                  { return this.http.get(`${this.url}/mes-cautions`); }

  // ── ENCHÈRES ───────────────────────────────────
  placerOffre(sid: number, montant: number): Observable<any> { return this.http.post(`${this.url}/sessions/${sid}/offrir`, { montant }); }
  getMesParticipations(): Observable<any>            { return this.http.get(`${this.url}/mes-participations`); }
  getMesOffresEnCours(): Observable<any>             { return this.http.get(`${this.url}/mes-offres-en-cours`); }

  // ── COMMISSAIRE — BIENS ───────────────────────
  getMesBiens(f: any = {}): Observable<any>          { return this.http.get(`${this.url}/commissaire/biens`, { params: this.toParams(f) }); }
  creerBien(fd: FormData): Observable<any>           { return this.http.post(`${this.url}/biens`, fd); }
  modifierBien(id: number, d: any): Observable<any>  { return this.http.put(`${this.url}/biens/${id}`, d); }
  publierBien(id: number): Observable<any>           { return this.http.post(`${this.url}/biens/${id}/publier`, {}); }
  supprimerBien(id: number): Observable<any>         { return this.http.delete(`${this.url}/biens/${id}`); }
  ajouterPhotos(id: number, fd: FormData): Observable<any> { return this.http.post(`${this.url}/biens/${id}/photos`, fd); }

  // ── COMMISSAIRE — SESSIONS ───────────────────
  getMesSessions(role: string): Observable<any> {
    const r = role === 'superviseur' ? 'superviseur/sessions' : 'commissaire/sessions';
    return this.http.get(`${this.url}/${r}`);
  }
  getSuperviseurs(): Observable<any>                 { return this.http.get(`${this.url}/superviseurs`);}
  creerSession(d: any): Observable<any>              { return this.http.post(`${this.url}/sessions`, d); }
  modifierSession(id: number, d: any): Observable<any> { return this.http.put(`${this.url}/sessions/${id}`, d); }
  superviserSession(id: number): Observable<any>     { return this.http.get(`${this.url}/superviseur/sessions/${id}`); }
  interrompreSession(id: number): Observable<any>    { return this.http.post(`${this.url}/sessions/${id}/interrompre`, {}); }
  reprendreSession(id: number): Observable<any>      { return this.http.post(`${this.url}/sessions/${id}/reprendre`, {}); }

  // ── INCIDENTS ──────────────────────────────────
  getIncidents(): Observable<any>                    { return this.http.get(`${this.url}/incidents`); }
  signalerIncident(d: any): Observable<any>          { return this.http.post(`${this.url}/incidents`, d); }
  decisionIncident(id: number, d: any): Observable<any> { return this.http.post(`${this.url}/incidents/${id}/decision`, d); }

  // ── ADMIN ──────────────────────────────────────
  getUtilisateurs(f: any = {}): Observable<any>      { return this.http.get(`${this.url}/utilisateurs`, { params: this.toParams(f) }); }
  validerCompte(id: number): Observable<any>          { return this.http.post(`${this.url}/utilisateurs/${id}/valider`, {}); }
  rejeterCompte(id: number, motif: string): Observable<any> { return this.http.post(`${this.url}/utilisateurs/${id}/rejeter`, { motif }); }
  suspendrCompte(id: number, motif: string): Observable<any> { return this.http.post(`${this.url}/utilisateurs/${id}/suspendre`, { motif }); }
  creerCompteInterne(d: any): Observable<any>        { return this.http.post(`${this.url}/utilisateurs/interne`, d); }
  getLogs(f: any = {}): Observable<any>              { return this.http.get(`${this.url}/logs`, { params: this.toParams(f) }); }
  getConfigurations(): Observable<any>               { return this.http.get(`${this.url}/configurations`); }
  modifierConfiguration(id: number, valeur: string): Observable<any> { return this.http.put(`${this.url}/configurations/${id}`, { valeur }); }
  getDashboardAdmin(): Observable<any>               { return this.http.get(`${this.url}/admin/dashboard`); }
  getDashboardCommissaire(): Observable<any>         { return this.http.get(`${this.url}/commissaire/dashboard`); }
  getPermissions(): Observable<any>                    { return this.http.get(`${this.url}/permissions`); }
  getRoles(): Observable<any>                        { return this.http.get(`${this.url}/roles`); }
  creerRole(d: any): Observable<any>                 { return this.http.post(`${this.url}/roles`, d); }
  modifierRole(id: number, d: any): Observable<any>   { return this.http.put(`${this.url}/roles/${id}`, d); }
  supprimerRole(id: number): Observable<any>          { return this.http.delete(`${this.url}/roles/${id}`); }

  syncRolePermissions(roleId: number, permIds: number[]): Observable<any> {
    return this.http.post(`${this.url}/roles/${roleId}/permissions`, { permissions: permIds });
}
}
