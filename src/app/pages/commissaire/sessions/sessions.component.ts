import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {
  sessions: any[] = [];
  biensPublies: any[] = [];
  superviseurs: any[] = [];
  message = '';
  erreur = '';
  chargement = true;

  modeFormulaire: 'creation' | null = null;
  form: any = {
    bien_id: '',
    superviseur_id: '',
    date_debut: '',
    date_fin: '',
    mise_a_prix_effective: '',
    montant_min_surenchere: 1000,
    prix_reserve: ''
  };

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.api.getMesSessions('commissaire_priseur').subscribe({
      next: res => {
        this.sessions = res.data.data ?? [];
        this.chargement = false;
      },
      error: () => { this.chargement = false; }
    });
    this.api.getMesBiens({ statut: 'publie' }).subscribe({
      next: res => (this.biensPublies = res.data.data ?? [])
    });
    this.api.getUtilisateurs({ role: 'superviseur' }).subscribe({
      next: res => (this.superviseurs = res.data.data ?? [])
    });
  }

  ouvrirCreation(): void {
    this.modeFormulaire = 'creation';
    this.form = {
      bien_id: '',
      superviseur_id: '',
      date_debut: '',
      date_fin: '',
      mise_a_prix_effective: '',
      montant_min_surenchere: 1000,
      prix_reserve: ''
    };
  }

  creerSession(): void {
    this.erreur = '';
    this.message = '';
    this.api.creerSession(this.form).subscribe({
      next: res => {
        this.message = res.message;
        this.modeFormulaire = null;
        this.ngOnInit();
      },
      error: err => {
        this.erreur = err.error?.message ?? 'Erreur lors de la création de la session.';
      }
    });
  }

  interrompre(id: number): void {
    if (!confirm('Suspendre cette enchère ?')) return;
    this.api.interrompreSession(id).subscribe({
      next: res => {
        this.message = res.message;
        this.ngOnInit();
      },
      error: err => {
        this.erreur = err.error?.message ?? 'Erreur.';
      }
    });
  }

  reprendre(id: number): void {
    this.api.reprendreSession(id).subscribe({
      next: res => {
        this.message = res.message;
        this.ngOnInit();
      },
      error: err => {
        this.erreur = err.error?.message ?? 'Erreur.';
      }
    });
  }

  libelleStatut(s: string): string {
    const l: any = {
      a_venir: 'À venir',
      en_cours: 'En cours',
      terminee: 'Terminée',
      interrompue: 'Interrompue'
    };
    return l[s] ?? s;
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  annuler(): void {
    this.modeFormulaire = null;
    this.erreur = '';
    this.message = '';
  }
}
