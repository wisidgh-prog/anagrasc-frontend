import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  sessionForm: FormGroup;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.sessionForm = this.fb.group({
      bien_id: ['', Validators.required],
      superviseur_id: [''],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      mise_a_prix_effective: ['', [Validators.required, Validators.min(0)]],
      montant_min_surenchere: [1000, [Validators.required, Validators.min(1)]],
      prix_reserve: ['']
    });
  }

  ngOnInit(): void {
    this.chargerSessions();
    this.api.getMesBiens({ statut: 'publie' }).subscribe({
      next: res => (this.biensPublies = res.data.data ?? [])
    });
    // this.api.getSuperviseurs().subscribe({
    //   next: res => (this.superviseurs = res.data)
    // });
  }

  chargerSessions(): void {
    this.chargement = true;
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
    this.api.getSuperviseurs().subscribe({
      next: res => (this.superviseurs = res.data )
    });
  }

  ouvrirCreation(): void {
    this.modeFormulaire = 'creation';
    this.sessionForm.reset({
      bien_id: '', superviseur_id: '', date_debut: '', date_fin: '',
      mise_a_prix_effective: '', montant_min_surenchere: 1000, prix_reserve: ''
    });
  }

  creerSession(): void {
    if (this.sessionForm.invalid) {
      this.erreur = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    this.erreur = '';
    this.message = '';
    this.api.creerSession(this.sessionForm.value).subscribe({
      next: res => {
        this.message = res.message;
        this.modeFormulaire = null;
        this.chargerSessions();
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
        this.chargerSessions();
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
        this.chargerSessions();
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
