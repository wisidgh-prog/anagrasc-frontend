import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-biens',
  templateUrl: './biens.component.html',
  styleUrls: ['./biens.component.scss']
})
export class BiensComponent implements OnInit {
  biens: any[] = [];
  categories: any[] = [];
  message = '';
  erreur = '';
  chargement = true;

  modeFormulaire: 'ajout' | 'modification' | null = null;
  bienSelectionne: any = null;
  bienForm: FormGroup;
  photosFichiers: File[] = [];
  filtreStatut = '';
  horairesDisponibles = [
  'Lun-Ven : 08h - 12h',
  'Lun-Ven : 14h - 17h',
  'Lun-Ven : 08h - 17h',
  'Lun-Sam : 08h - 12h',
  'Lun-Sam : 14h - 18h',
  'Lun-Sam : 08h - 18h',
  'Tous les jours : 08h - 17h',
  'Sur rendez-vous uniquement'
];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private fb: FormBuilder,
    private snack: MatSnackBar,
  ) {
    this.bienForm = this.fb.group({
      categorie_id: ['', Validators.required],
      titre: ['', Validators.required],
      description: ['', Validators.required],
      mise_a_prix: ['', [Validators.required, Validators.min(1)]],
      lieu_retrait: ['', Validators.required],
      horaires_visite: [''],
      remarques: ['']
    });
  }

  ngOnInit(): void {
    this.api.getCategories().subscribe({ next: res => this.categories = res.data });
    this.charger();
  }

  charger(): void {
    this.chargement = true;
    this.api.getMesBiens({ statut: this.filtreStatut }).subscribe({
      next: res => {
        this.biens = res.data ;
        this.chargement = false;
      },
      error: () => { this.chargement = false; }
    });
  }

  ouvrirAjout(): void {
    this.modeFormulaire = 'ajout';
    this.bienSelectionne = null;
    this.bienForm.reset({
      categorie_id: '', titre: '', description: '', mise_a_prix: '',
      lieu_retrait: '', horaires_visite: '', remarques: ''
    });
    this.photosFichiers = [];
  }

  ouvrirModification(bien: any): void {
    this.modeFormulaire = 'modification';
    this.bienSelectionne = bien;
    this.bienForm.patchValue({
      categorie_id: bien.categorie_id,
      titre: bien.titre,
      description: bien.description,
      mise_a_prix: bien.mise_a_prix,
      lieu_retrait: bien.lieu_retrait,
      horaires_visite: bien.horaires_visite ?? '',
      remarques: bien.remarques ?? ''
    });
  }

  onPhotos(event: any): void {
    this.photosFichiers = Array.from(event.target.files);
  }

  soumettre(): void {
    if (this.bienForm.invalid) {
      this.erreur = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    this.erreur = '';
    this.message = '';
    const fd = new FormData();
    if (!this.bienForm.value.categorie_id) {
  this.erreur = 'Veuillez sélectionner une catégorie.';
  return;
}
    Object.keys(this.bienForm.value).forEach(k => fd.append(k, this.bienForm.value[k]));
    this.photosFichiers.forEach(f => fd.append('photos[]', f));

    if (this.modeFormulaire === 'ajout') {
      this.api.creerBien(fd).subscribe({
        next: res => {
          this.message = res.message;
          this.modeFormulaire = null;
          this.charger();
        },
        error: err => this.erreur = err.error?.message ?? 'Erreur lors de la création.'
      });
    } else {
      this.api.modifierBien(this.bienSelectionne.id, this.bienForm.value).subscribe({
        next: res => {
          this.snack.open(res.message, 'Fermer', { duration: 13000 });
          this.modeFormulaire = null;
          this.charger();
        },
        error: err => this.erreur = err.error?.message ?? 'Erreur lors de la modification.'
      });
    }
  }

  supprimer(id: number): void {
    if (!confirm('Confirmer la suppression de ce bien ?')) return;
    this.api.supprimerBien(id).subscribe({
      next: res => {
        this.message = res.message;
        this.charger();
      },
      error: err => this.erreur = err.error?.message ?? 'Suppression impossible.'
    });
  }

  libelleStatut(s: string): string {
    const l: any = {
      en_attente_validation: 'En attente de validation',
       publie: 'Publié',
       en_cours: 'En cours',
       vendu: 'Vendu',
       annule: 'Annulé',
       rejete: 'Rejeté',
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
