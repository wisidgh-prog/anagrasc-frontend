import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// Combine date (Date object) + heure (string "HH:MM") en string ISO
function combinerDateHeure(date: Date | null, heure: string | null): string | null {
  if (!date || !heure) return null;
  const [h, m] = heure.split(':').map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d.toISOString().slice(0, 19).replace('T', ' '); // format Laravel : "Y-m-d H:i:s"
}

// Validateur : date_fin combinée > date_debut combinée
function dateTimeFinApresDebutValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const dateDebut = group.get('date_debut_date')?.value;
    const heureDebut = group.get('heure_debut')?.value;
    const dateFin = group.get('date_fin_date')?.value;
    const heureFin = group.get('heure_fin')?.value;

    if (!dateDebut || !heureDebut || !dateFin || !heureFin) return null;

    const debut = combinerDateHeure(dateDebut, heureDebut);
    const fin = combinerDateHeure(dateFin, heureFin);

    if (debut && fin && fin <= debut) {
      return { dateFinInvalide: true };
    }
    return null;
  };
}

// Validateur : date_debut dans le futur (heure incluse)
function dateDebutFuturValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const date = group.get('date_debut_date')?.value;
    const heure = group.get('heure_debut')?.value;
    if (!date || !heure) return null;
    const debut = combinerDateHeure(date, heure);
    if (debut && debut <= new Date().toISOString().slice(0, 19).replace('T', ' ')) {
      return { debutPasse: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {
  sessions: any[]      = [];
  biensPublies: any[]  = [];
  superviseurs: any[]  = [];
  message    = '';
  erreur     = '';
  chargement = true;
  aujourdhui = new Date(); // borne min du datepicker

  modeFormulaire: 'creation' | null = null;
  sessionForm: FormGroup;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private fb: FormBuilder,
    private snack: MatSnackBar
  ) {
    this.sessionForm = this.fb.group(
      {
        bien_id:                ['', Validators.required],
        superviseur_id:         [''],
        date_debut_date:        [null, Validators.required],
        heure_debut:            ['', Validators.required],
        date_fin_date:          [null, Validators.required],
        heure_fin:              ['', Validators.required],
        mise_a_prix_effective:  ['', [Validators.required, Validators.min(0)]],
        montant_min_surenchere: [1000, [Validators.required, Validators.min(1)]],
        prix_reserve:           ['']
      },
      {
        validators: [
          dateDebutFuturValidator(),
          dateTimeFinApresDebutValidator()
        ]
      }
    );
  }

  ngOnInit(): void {
    this.chargerSessions();
    this.api.getBiens({ statut: 'publie' }).subscribe({
      next: (res: any) => this.biensPublies = res.data ?? []
    });
    this.api.getSuperviseurs().subscribe({
      next: (res: any) => this.superviseurs = res.data ?? []
    });
  }

  chargerSessions(): void {
    this.chargement = true;
    this.api.getMesSessions('commissaire_priseur').subscribe({
      next: (res: any) => {
        this.sessions   = res.data ?? [];
        this.chargement = false;
      },
      error: () => { this.chargement = false; }
    });
  }

  ouvrirCreation(): void {
    this.modeFormulaire = 'creation';
    this.sessionForm.reset({
      bien_id: '', superviseur_id: '',
      date_debut_date: null, heure_debut: '',
      date_fin_date: null, heure_fin: '',
      mise_a_prix_effective: '', montant_min_surenchere: 1000, prix_reserve: ''
    });
  }

  creerSession(): void {
    this.sessionForm.markAllAsTouched();

    if (this.sessionForm.hasError('debutPasse')) {
      this.erreur = 'La date/heure de début doit être dans le futur.';
      return;
    }
    if (this.sessionForm.hasError('dateFinInvalide')) {
      this.erreur = 'La date/heure de fin doit être après la date/heure de début.';
      return;
    }
    if (this.sessionForm.invalid) {
      this.erreur = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.erreur  = '';
    this.message = '';

    const v = this.sessionForm.value;

    // Construire le payload avec dates combinées
    const payload = {
      bien_id:                v.bien_id,
      superviseur_id:         v.superviseur_id || null,
      date_debut:             combinerDateHeure(v.date_debut_date, v.heure_debut),
      date_fin:               combinerDateHeure(v.date_fin_date, v.heure_fin),
      mise_a_prix_effective:  v.mise_a_prix_effective,
      montant_min_surenchere: v.montant_min_surenchere,
      prix_reserve:           v.prix_reserve || null,
    };

    this.api.creerSession(payload).subscribe({
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
      error: (err: any) => { this.erreur = err.error?.message ?? 'Erreur.'; }
    });
  }

  reprendre(id: number): void {
    this.api.reprendreSession(id).subscribe({
      next: (res: any) => {
        this.snack.open(res.message, 'Fermer', { duration: 3000 });
        this.chargerSessions();
      },
      error: (err: any) => { this.erreur = err.error?.message ?? 'Erreur.'; }
    });
  }

  libelleStatut(s: string): string {
    const l: any = {
      a_venir:     'À venir',
      en_cours:    'En cours',
      terminee:    'Terminée',
      interrompue: 'Interrompue'
    };
    return l[s] ?? s;
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  annuler(): void {
    this.modeFormulaire = null;
    this.erreur  = '';
    this.message = '';
  }
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

