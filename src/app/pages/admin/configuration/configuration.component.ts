import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  configurations: any[] = [];
  messages: { [id: number]: string } = {};
  erreurs: { [id: number]: string } = {};
  chargement = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getConfigurations().subscribe({
      next: res => {
        this.configurations = res.data;
        this.chargement = false;
      },
      error: () => { this.chargement = false; }
    });
  }

  modifier(config: any): void {
    this.messages[config.id] = '';
    this.erreurs[config.id] = '';
    this.api.modifierConfiguration(config.id, config.valeur).subscribe({
      next: res => { this.messages[config.id] = 'Enregistré.'; },
      error: err => { this.erreurs[config.id] = err.error?.message ?? 'Erreur.'; }
    });
  }

  libelleConfig(cle: string): string {
    const l: any = {
      taux_caution: 'Taux de caution (%)',
      caution_minimum: 'Caution minimum (FCFA)',
      taux_frais_adjudication: 'Frais post-adjudication (%)',
      min_surenchere: 'Surenchère minimum (FCFA)',
      delai_paiement_gagnant: 'Délai paiement gagnant (heures)',
      delai_paiement_suivant: 'Délai paiement second enchérisseur (heures)',
    };
    return l[cle] ?? cle;
  }
}
