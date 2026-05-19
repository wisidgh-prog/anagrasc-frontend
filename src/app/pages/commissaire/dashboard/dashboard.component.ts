import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-dashboard-commissaire',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardCommissaireComponent implements OnInit {
  stats: any = null;
  biens: any[] = [];
  sessions: any[] = [];
  chargement = true;
  erreur = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    // Charger les statistiques du dashboard
    this.api.getDashboardCommissaire().subscribe({
      next: (res) => {
        this.stats = res.data;
      },
      error: (err) => {
        this.erreur = 'Impossible de charger les indicateurs.';
        console.error(err);
      }
    });

    // Charger les 5 derniers biens publiés
    this.api.getMesBiens({ statut: 'publie' }).subscribe({
      next: (res) => {
        this.biens = (res.data.data ?? []).slice(0, 5);
      },
      error: () => {
        this.erreur = 'Erreur lors du chargement des biens.';
      }
    });

    // Charger les 5 dernières sessions
    this.api.getMesSessions('commissaire_priseur').subscribe({
      next: (res) => {
        this.sessions = (res.data.data ?? []).slice(0, 5);
      },
      error: () => {
        this.erreur = 'Erreur lors du chargement des sessions.';
      }
    });

    // Indiquer que le chargement est terminé (même si des erreurs subsistent)
    this.chargement = false;
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
