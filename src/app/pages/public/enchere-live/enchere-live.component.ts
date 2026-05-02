import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-enchere-live',
  templateUrl: './enchere-live.component.html',
  styleUrls: ['./enchere-live.component.scss']
})
export class EnchereLiveComponent implements OnInit, OnDestroy {
  sessionId = 0;
  session: any  = null;
  offres: any[] = [];
  meilleureOffre   = 0;
  idMeilleur       = '';
  secondesRestantes = 0;
  monOffre    = 0;
  chargement  = false;

  // Colonnes du tableau Material
  colonnes = ['id_anonyme', 'montant', 'heure'];

  private intervalPolling: any;
  private intervalTimer  : any;

  constructor(
    private route : ActivatedRoute,
    private api   : ApiService,
    public  auth  : AuthService,
    private router: Router,
    private snack : MatSnackBar
  ) {}

  ngOnInit(): void {
    this.sessionId = +this.route.snapshot.paramMap.get('id')!;
    this.chargerSession();
    // Polling 3 secondes
    this.intervalPolling = setInterval(() => this.chargerOffres(), 3000);
    // Timer 1 seconde
    this.intervalTimer   = setInterval(() => {
      if (this.secondesRestantes > 0) this.secondesRestantes--;
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalPolling);
    clearInterval(this.intervalTimer);
  }

  chargerSession(): void {
    this.api.getSession(this.sessionId).subscribe({
      next: r => {
        this.session           = r.data;
        this.secondesRestantes = r.data.secondes_restantes ?? 0;
        this.meilleureOffre    = r.data.meilleure_offre ?? 0;
        this.idMeilleur        = r.data.id_meilleur ?? '';
      }
    });
  }

  chargerOffres(): void {
    this.api.getOffres(this.sessionId).subscribe({
      next: r => {
        this.offres            = r.data.offres ?? [];
        this.meilleureOffre    = r.data.meilleure_offre ?? 0;
        this.idMeilleur        = r.data.id_meilleur ?? '';
        this.secondesRestantes = r.data.secondes_restantes ?? 0;
        if (r.data.statut === 'terminee') clearInterval(this.intervalPolling);
      }
    });
  }

  placerOffre(): void {
    if (!this.auth.estConnecte) { this.router.navigate(['/connexion']); return; }
    if (!this.monOffre || this.monOffre <= 0) {
      this.snack.open('Saisissez un montant valide.', 'Fermer', { duration: 3000 });
      return;
    }
    this.chargement = true;
    this.api.placerOffre(this.sessionId, this.monOffre).subscribe({
      next: (res) => {
        this.snack.open('Offre enregistrée !', '', { duration: 2000, panelClass: 'snack-success' });
        this.monOffre   = 0;
        this.chargement = false;
        this.chargerOffres();
      },
      error: (err) => {
        this.snack.open(err.error?.message ?? 'Erreur', 'Fermer',
          { duration: 4000, panelClass: 'snack-error' });
        this.chargement = false;
      }
    });
  }

  get timerFormate(): string {
    const h = Math.floor(this.secondesRestantes / 3600);
    const m = Math.floor((this.secondesRestantes % 3600) / 60);
    const s = this.secondesRestantes % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
