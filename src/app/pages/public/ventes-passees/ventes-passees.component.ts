import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-ventes-passees',
  templateUrl: './ventes-passees.component.html',
  styleUrls: ['./ventes-passees.component.scss'],

})
export class VentesPasseesComponent implements OnInit {
  ventes: any[] = [];
  categories: any[] = [];
  chargement = true;
  meta: any = null; // pagination metadata
  filtres = {
    categorie_id: '',
    date_debut: '',
    date_fin: '',
    page: 1,
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getCategories().subscribe({ next: (res) => (this.categories = res.data) });
    this.charger();
  }

  charger(): void {
    this.chargement = true;
    this.api.getVentesPassees(this.filtres).subscribe({
      next: (res) => {
        this.ventes = res.data.data ?? [];
        this.meta = res.data; // contient current_page, last_page...
        this.chargement = false;
      },
      error: () => {
        this.chargement = false;
      },
    });
  }

  appliquerFiltres(): void {
    this.filtres.page = 1;
    this.charger();
  }

  reinitialiser(): void {
    this.filtres = { categorie_id: '', date_debut: '', date_fin: '', page: 1 };
    this.charger();
  }

  changerPage(p: number): void {
    this.filtres.page = p;
    this.charger();
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
