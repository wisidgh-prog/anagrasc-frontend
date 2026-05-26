import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss']
})
export class IncidentsComponent implements OnInit {
  incidents: any[] = [];
  incidentOuvert: any = null;   // incident sélectionné pour décision
  message = '';
  erreur = '';
  chargement = true;

  decision = {
    decision: 'maintien',
    note_decision: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getIncidents().subscribe({
      next: res => {
        this.incidents = res.data;
        this.chargement = false;
      },
      error: () => { this.chargement = false; }
    });
  }

  ouvrirDecision(incident: any): void {
    this.incidentOuvert = incident;
    this.decision = { decision: 'maintien', note_decision: '' };
  }

  prendreDecision(): void {
    this.erreur = '';
    this.message = '';
    this.api.decisionIncident(this.incidentOuvert.id, this.decision).subscribe({
      next: res => {
        this.message = res.message;
        this.incidentOuvert = null;
        this.ngOnInit(); // recharge la liste
      },
      error: err => {
        this.erreur = err.error?.message ?? 'Erreur lors de la décision.';
      }
    });
  }

  libelleType(t: string): string {
    const l: any = {
      offre_litigieuse: 'Offre litigieuse',
      probleme_technique: 'Pb technique',
      fraude_suspecte: 'Fraude',
      autre: 'Autre'
    };
    return l[t] ?? t;
  }

  annuler(): void {
    this.incidentOuvert = null;
    this.erreur = '';
    this.message = '';
  }
}
