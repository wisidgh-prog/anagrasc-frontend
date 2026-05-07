import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {
  biens: any[]      = [];
  categories: any[] = [];
  chargement        = true;
  filtres = { search: '', categorie_id: '', statut: '' };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getCategories().subscribe({ next: r => this.categories = r.data });
    this.chargerBiens();
  }

  chargerBiens(): void {
  this.chargement = true;
  this.api.getBiens(this.filtres).subscribe({
    next: (res) => {
      this.biens = res.data?.data ?? [];   // extrait le tableau paginé
      this.chargement = false;
    },
    error: () => { this.chargement = false; }
  });
}

  reinitialiser(): void {
    this.filtres = { search: '', categorie_id: '', statut: '' };
    this.chargerBiens();
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
