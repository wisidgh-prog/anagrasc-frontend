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
  metrics: any[] = [];
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getDashboardAdmin().subscribe({
      next: res => {
        this.stats = res.data;
        this.chargement = false;

        this.metrics = [
          { label: 'Enchères en cours', value: this.stats.encheres_en_cours, color: 'var(--primary)' },
          { label: 'À venir', value: this.stats.encheres_a_venir, color: 'var(--primary)' },
          { label: 'Enchérisseurs', value: this.stats.encherisseurs_total, color: 'var(--primary)' },
          { label: 'En attente', value: this.stats.comptes_en_attente, color: '#f57f17' },
          { label: 'Recettes du mois', value: this.formatFCFA(this.stats.recettes_du_mois), color: '#059669' },
          { label: 'Cautions bloquées', value: this.formatFCFA(this.stats.cautions_bloquees), color: '#c62828' },
       ];

      },
      error: () => { this.chargement = false; }
    });

  }

  formatFCFA(n: number): string {
    if (!n) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
