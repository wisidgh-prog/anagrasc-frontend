import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-encherisseur',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardEncherisseurComponent implements OnInit {
  wallet: any = null;
  offresEnCours: any[] = [];
  utilisateur: any = null;

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.utilisateur = this.auth.currentUser;
    this.api.getWallet().subscribe({ next: r => this.wallet = r.data });
    this.api.getMesOffresEnCours().subscribe({ next: r => this.offresEnCours = r.data });
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  formatTimer(s: number): string {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return [h, m, sec].map(v => v.toString().padStart(2, '0')).join(':');
  }
}
