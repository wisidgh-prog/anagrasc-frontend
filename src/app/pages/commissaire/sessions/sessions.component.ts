import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private fb: FormBuilder,
    private snack: MatSnackBar   // ajouté pour les notifications
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

    // Charger TOUS les biens publiés (pas seulement ceux du commissaire)
    this.api.getBiens({ statut: 'publie' }).subscribe({
      next: (res: any) => this.biensPublies = res.data ?? []
    });

    // Charger la liste des superviseurs (si la route existe)
    this.api.getSuperviseurs().subscribe({
      next: (res: any) => this.superviseurs = res.data 
    });
  }

  chargerSessions(): void {
    this.chargement = true;
    this.api.getMesSessions('commissaire_priseur').subscribe({
      next: (res: any) => {
        this.sessions = res.data ?? [];
        this.chargement = false;
      },
      error: () => { this.chargement = false; }
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
      next: (res: any) => {
        this.snack.open(res.message, 'Fermer', { duration: 3000 });
        this.modeFormulaire = null;
        this.chargerSessions();
      },
      error: (err: any) => {
        this.erreur = err.error?.message ?? 'Erreur lors de la création de la session.';
      }
    });
  }

  interrompre(id: number): void {
    if (!confirm('Suspendre cette enchère ?')) return;
    this.api.interrompreSession(id).subscribe({
      next: (res: any) => {
        this.snack.open(res.message, 'Fermer', { duration: 3000 });
        this.chargerSessions();
      },
      error: (err: any) => {
        this.erreur = err.error?.message ?? 'Erreur.';
      }
    });
  }

  reprendre(id: number): void {
    this.api.reprendreSession(id).subscribe({
      next: (res: any) => {
        this.snack.open(res.message, 'Fermer', { duration: 3000 });
        this.chargerSessions();
      },
      error: (err: any) => {
        this.erreur = err.error?.message ?? 'Erreur.';
      }
    });
  }

  // demarrerSession(id: number): void {
  //   if (!confirm('Démarrer cette session maintenant ?')) return;
  //   this.api.demarrerSession(id).subscribe({
  //     next: (res: any) => {
  //       this.snack.open(res.message, 'Fermer', { duration: 3000 });
  //       this.chargerSessions();
  //     },
  //     error: (err: any) => {
  //       this.erreur = err.error?.message ?? 'Erreur.';
  //     }
  //   });
  // }

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
