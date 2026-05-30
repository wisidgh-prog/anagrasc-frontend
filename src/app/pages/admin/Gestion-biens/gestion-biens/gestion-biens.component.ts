import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gestion-biens',
  templateUrl: './gestion-biens.component.html',
  styleUrls: ['./gestion-biens.component.scss']
})
export class GestionBiensComponent implements OnInit {
  biens: any[] = [];
  categories: any[] = [];
  filtreStatut = '';
  chargement = true;

  bienSelectionne: any = null;
  bienForm: FormGroup;
  modeModification = false;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private snack: MatSnackBar
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
    this.api.getCategories().subscribe(res => this.categories = res.data);
    this.charger();
  }

  charger(): void {
    this.chargement = true;
    this.api.getBiensAdmin({ statut: this.filtreStatut }).subscribe({
      next: (res: any) => {
        this.biens = res.data ?? [];
        this.chargement = false;
      },
      error: () => { this.chargement = false; }
    });
  }

  valider(id: number): void {
    if (!confirm('Valider ce bien et le publier ?')) return;
    this.api.validerBien(id).subscribe({
      next: (res) => {
        this.snack.open(res.message, 'Fermer', { duration: 3000 });
        this.charger();
      },
      error: (err) => this.snack.open(err.error?.message ?? 'Erreur', 'Fermer', { duration: 3000 })
    });
  }

  rejeter(id: number): void {
    const motif = prompt('Motif du rejet :');
    if (!motif) return;
    this.api.rejeterBien(id, motif).subscribe({
      next: (res) => {
        this.snack.open(res.message, 'Fermer', { duration: 3000 });
        this.charger();
      },
      error: (err) => this.snack.open(err.error?.message ?? 'Erreur', 'Fermer', { duration: 3000 })
    });
  }

  ouvrirModification(bien: any): void {
    this.bienSelectionne = bien;
    this.modeModification = true;
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

  annulerModification(): void {
    this.modeModification = false;
    this.bienSelectionne = null;
  }

  enregistrerModification(): void {
    if (this.bienForm.invalid) {
      this.snack.open('Veuillez remplir les champs obligatoires.', 'Fermer', { duration: 3000 });
      return;
    }
    this.api.modifierBien(this.bienSelectionne.id, this.bienForm.value).subscribe({
      next: (res: any) => {
        this.snack.open(res.message, 'Fermer', { duration: 3000 });
        this.annulerModification();
        this.charger();
      },
      error: (err: any) => {
        this.snack.open(err.error?.message ?? 'Erreur', 'Fermer', { duration: 3000 });
      }
    });
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  libelleStatut(s: string): string {
    const l: any = {
      en_attente_validation: 'En attente',
      publie: 'Publié',
      en_cours: 'En cours',
      vendu: 'Vendu',
      annule: 'Annulé',
      rejete: 'Rejeté'
    };
    return l[s] ?? s;
  }
}
