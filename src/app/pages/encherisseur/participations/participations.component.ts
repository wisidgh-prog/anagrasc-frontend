import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-participations',
  templateUrl: './participations.component.html',
  styleUrls: ['./participations.component.scss']
})
export class ParticipationsComponent implements OnInit {
  participations: any[] = [];
  chargement = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getMesParticipations().subscribe({
      next: r => {
        this.participations = r.data ?? [];
        this.chargement = false;
      },
      error: () => { this.chargement = false; }
    });
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
