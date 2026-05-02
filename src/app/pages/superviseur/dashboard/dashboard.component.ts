import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-dashboard-superviseur',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardSuperviseurComponent implements OnInit {
  sessions: any[] = [];
  chargement = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
   this.api.getMesSessions('superviseur').subscribe({
      next: res => {
        this.sessions = res.data ?? [];
        this.chargement = false;
      },
      error: () => { this.chargement = false; }
    });
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
