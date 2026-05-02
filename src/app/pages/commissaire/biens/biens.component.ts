import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

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
  form: any = {
    categorie_id: '',
    titre: '',
    description: '',
    mise_a_prix: '',
    lieu_retrait: '',
    horaires_visite: '',
    remarques: ''
  };
  photosFichiers: File[] = [];
  filtreStatut = '';

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.api.getCategories().subscribe({ next: res => this.categories = res.data });
    this.charger();
  }

  charger(): void {
    this.chargement = true;
    this.api.getMesBiens({ statut: this.filtreStatut }).subscribe({
      next: res => {
        this.biens = res.data.data ?? [];
        this.chargement = false;
      },
      error: () => { this.chargement = false; }
    });
  }

  ouvrirAjout(): void {
    this.modeFormulaire = 'ajout';
    this.bienSelectionne = null;
    this.form = {
      categorie_id: '', titre: '', description: '',
      mise_a_prix: '', lieu_retrait: '', horaires_visite: '', remarques: ''
    };
    this.photosFichiers = [];
  }

  ouvrirModification(bien: any): void {
    this.modeFormulaire = 'modification';
    this.bienSelectionne = bien;
    this.form = {
      categorie_id: bien.categorie_id,
      titre: bien.titre,
      description: bien.description,
      mise_a_prix: bien.mise_a_prix,
      lieu_retrait: bien.lieu_retrait,
      horaires_visite: bien.horaires_visite ?? '',
      remarques: bien.remarques ?? ''
    };
  }

  onPhotos(event: any): void {
    this.photosFichiers = Array.from(event.target.files);
  }

  soumettre(): void {
    this.erreur = '';
    this.message = '';
    const fd = new FormData();
    Object.keys(this.form).forEach(k => fd.append(k, this.form[k]));
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
      this.api.modifierBien(this.bienSelectionne.id, this.form).subscribe({
        next: res => {
          this.message = res.message;
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
    const l: any = { publie: 'Publié', en_cours: 'En cours', vendu: 'Vendu', annule: 'Annulé' };
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
