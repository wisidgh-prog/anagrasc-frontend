import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardAdminComponent implements OnInit {
  stats: any = null;
  chargement = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getDashboardAdmin().subscribe({
      next: res => {
        this.stats = res.data;
        this.chargement = false;
      },
      error: () => { this.chargement = false; }
    });
  }

  formatFCFA(n: number): string {
    if (!n) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
