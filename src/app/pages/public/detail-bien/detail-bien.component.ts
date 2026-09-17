import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';              // ← pour le pipe date
import { RouterModule, ActivatedRoute, Router } from '@angular/router'; // ← pour routerLink
import { ApiService } from '../../../core/services/api.service';
import { MatIconModule } from '@angular/material/icon';      // si utilisé dans le template
import { MatCardModule } from '@angular/material/card';      // etc.
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detail-bien',
  standalone: true,   
  templateUrl: './detail-bien.component.html',
  styleUrls: ['./detail-bien.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class DetailBienComponent implements OnInit {
  bien: any = null;
  session: any = null;          // session associée (à venir ou en cours)
  photoActive = 0;              // index de la photo affichée
  chargement = true;
  storageUrl = environment.storageUrl;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.api.getBien(id).subscribe({
      next: (res) => {
        this.bien = res.data;
        // Cherche une session à venir ou en cours pour ce bien
        this.session = res.data.sessions?.find((s: any) =>
          ['a_venir', 'en_cours'].includes(s.statut)
        ) ?? null;
        this.chargement = false;
      },
      error: () => {
        this.router.navigate(['/catalogue']);
      }
    });
  }

  setPhoto(index: number): void {
    this.photoActive = index;
  }

  allerEnchereLive(): void {
    if (this.session?.statut === 'en_cours') {
      this.router.navigate(['/encheres', this.session.id, 'live']);
    }
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  formatTimer(s: number): string {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return [h, m, sec].map(v => v.toString().padStart(2, '0')).join(':');
  }
}
