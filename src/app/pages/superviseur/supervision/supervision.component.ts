import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-supervision',
  templateUrl: './supervision.component.html',
  styleUrls: ['./supervision.component.scss']
})
export class SupervisionComponent implements OnInit, OnDestroy {
  sessionId = 0;
  data: any = null;
  chargement = false;
  afficherFormIncident = false;
  colonnesOffres = ['id_anonyme', 'montant', 'heure'];

  incident = {
    type_incident: 'offre_litigieuse',
    description: '',
    id_concerne: ''
  };

  private intervalPolling: any;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.sessionId = +this.route.snapshot.paramMap.get('id')!;
    this.chargerDonnees();
    this.intervalPolling = setInterval(() => this.chargerDonnees(), 3000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalPolling);
  }

  chargerDonnees(): void {
    this.api.superviserSession(this.sessionId).subscribe({
      next: r => this.data = r.data
    });
  }

  signalerIncident(): void {
    this.chargement = true;
    this.api.signalerIncident({
      ...this.incident,
      session_id: this.sessionId
    }).subscribe({
      next: res => {
        this.snack.open(res.message, '', { duration: 3000, panelClass: 'snack-success' });
        this.afficherFormIncident = false;
        this.incident = { type_incident: 'offre_litigieuse', description: '', id_concerne: '' };
        this.chargement = false;
      },
      error: err => {
        this.snack.open(err.error?.message ?? 'Erreur', 'Fermer', { duration: 4000, panelClass: 'snack-error' });
        this.chargement = false;
      }
    });
  }

  get timerFormate(): string {
    const s = this.data?.secondes_restantes ?? 0;
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return [h, m, sec].map(v => v.toString().padStart(2, '0')).join(':');
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
