import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  logs: any[]  = [];
  chargement   = true;
  meta: any    = null;

  filtres: any = {
    action:     '',
    user_id:    '',
    date_debut: '',
    date_fin:   '',
    search:     '',
    page:       1,
  };

  actions = [
    { val: '',                    lib: 'Toutes les actions'   },
    { val: 'creation_bien',       lib: 'Création bien'        },
    { val: 'publication_bien',    lib: 'Publication bien'     },
    { val: 'creation_session',    lib: 'Création session'     },
    { val: 'adjudication',        lib: 'Adjudication'         },
    { val: 'interruption_enchere',lib: 'Interruption enchère' },
    { val: 'validation_compte',   lib: 'Validation compte'    },
    { val: 'incident_signale',    lib: 'Incident signalé'     },
    { val: 'modification_config', lib: 'Modification config'  },
    { val: 'offre',               lib: 'Offre placée'         },
  ];

  constructor(private api: ApiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement = true;

    this.api.getLogs(this.filtres).subscribe({
      next: res => {
        this.logs = res.data;   // tableau des logs
        this.meta = res;
        this.chargement = false;
      },
      error: () => { this.chargement = false; }
    });
  }

  appliquerFiltres(): void {
    this.filtres.page = 1; // revenir à la page 1 quand on filtre
    this.charger();
  }

  reinitialiser(): void {
    this.filtres = {
      action:     '',
      user_id:    '',
      date_debut: '',
      date_fin:   '',
      search:     '',
      page:       1,
    };
    this.charger();
  }

  changerPage(page: number): void {
    this.filtres.page = page;
    this.charger();
  }

  // ── Gestion des dates ────────────────────────────────────────────────────
  // MatDatepicker retourne un objet Date, pas une string.
  // Laravel attend une string au format YYYY-MM-DD.
  // Cette méthode fait la conversion et relance le chargement.

  onDateDebut(event: any): void {
    const date = event.value; // objet Date venant du MatDatepicker
    if (date) {
      // toISOString() = "2026-05-14T00:00:00.000Z" → on prend seulement les 10 premiers caractères
      this.filtres.date_debut = date.toISOString().substring(0, 10);
    } else {
      this.filtres.date_debut = '';
    }
    this.appliquerFiltres();
  }

  onDateFin(event: any): void {
    const date = event.value;
    if (date) {
      this.filtres.date_fin = date.toISOString().substring(0, 10);
    } else {
      this.filtres.date_fin = '';
    }
    this.appliquerFiltres();
  }

  // ── Couleur des badges selon l'action ───────────────────────────────────
  couleurAction(action: string): string {
    if (action.includes('incident'))   return 'bg-danger';
    if (action.includes('validation')) return 'bg-success';
    if (action.includes('adjudication')) return 'bg-primary';
    if (action.includes('config'))     return 'bg-warning text-dark';
    return 'bg-secondary';
  }

  // ── Export PDF ───────────────────────────────────────────────────────────
  exporterPDF(): void {
  this.api.exportLogs(this.filtres).subscribe({
    next: (blob) => {
      const url  = URL.createObjectURL(blob);
      const lien = document.createElement('a');
      lien.href     = url;
      lien.download = 'logs_anagrasc.pdf';
      lien.click();
      URL.revokeObjectURL(url);
    },
    error: () => console.error('Erreur export PDF')
  });
}
}
