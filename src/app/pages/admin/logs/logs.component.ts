import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  logs: any[] = [];
  chargement = true;
  meta: any = null;

  filtres: any = {
    action: '',
    user_id: '',
    date_debut: '',
    date_fin: '',
    search: '',
    page: 1,
  };

  actions = [
    { val: '', lib: 'Toutes les actions' },
    { val: 'creation_bien', lib: 'Création bien' },
    { val: 'publication_bien', lib: 'Publication bien' },
    { val: 'creation_session', lib: 'Création session' },
    { val: 'adjudication', lib: 'Adjudication' },
    { val: 'interruption_enchere', lib: 'Interruption enchère' },
    { val: 'validation_compte', lib: 'Validation compte' },
    { val: 'incident_signale', lib: 'Incident signalé' },
    { val: 'modification_config', lib: 'Modification config' },
    { val: 'offre', lib: 'Offre placée' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.charger(); }

  charger(): void {
    this.chargement = true;
    this.api.getLogs(this.filtres).subscribe({
      next: res => {
        this.logs = res.data ;
        this.meta = res.data;
        this.chargement = false;
      },
      error: () => { this.chargement = false; }
    });
  }

  appliquerFiltres(): void { this.filtres.page = 1; this.charger(); }

  reinitialiser(): void {
    this.filtres = { action: '', user_id: '', date_debut: '', date_fin: '', search: '', page: 1 };
    this.charger();
  }

  changerPage(p: number): void { this.filtres.page = p; this.charger(); }

  couleurAction(action: string): string {
    if (action.includes('incident')) return 'bg-danger';
    if (action.includes('validation')) return 'bg-success';
    if (action.includes('adjudication')) return 'bg-primary';
    if (action.includes('config')) return 'bg-warning text-dark';
    return 'bg-secondary';
  }
}
