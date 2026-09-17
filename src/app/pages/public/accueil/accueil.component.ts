import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  sessionsEnCours: any[] = [];
  sessionsAVenir: any[] = [];
  chargement = true;
  storageUrl = environment.storageUrl;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getBiens({ statut: 'en_cours' }).subscribe({
      next: (res) => {
        this.sessionsEnCours = res.data ;
        this.chargement = false;
      },
      error: () => (this.chargement = false)
    });
    this.api.getBiens({ statut: 'publie' }).subscribe({
      next: (res) => {
        this.sessionsAVenir = (res.data).slice(0, 4);
      }
    });
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
