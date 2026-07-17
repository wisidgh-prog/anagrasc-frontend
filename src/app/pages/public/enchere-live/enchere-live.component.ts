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
  sessionId         = 0;
  session: any      = null;
  offres: any[]     = [];
  meilleureOffre    = 0;
  idMeilleur        = '';
  secondesRestantes = -1;  
  monOffre          = 0;
  chargement        = false;
  sessionTerminee   = false;

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

    // Chargement initial complet
    this.chargerSession();

    // Polling toutes les 3s pour offres + resync timer
    this.intervalPolling = setInterval(() => this.chargerOffres(), 3000);

    // Timer local : décrémente seulement entre deux polls
    this.intervalTimer = setInterval(() => {
      if (this.secondesRestantes > 0) {
        this.secondesRestantes--;
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.stopIntervals();
  }

  private stopIntervals(): void {
    clearInterval(this.intervalPolling);
    clearInterval(this.intervalTimer);
  }

  chargerSession(): void {
    this.api.getSession(this.sessionId).subscribe({
      next: r => {
        this.session           = r.data;
        this.meilleureOffre    = r.data.meilleure_offre    ?? 0;
        this.idMeilleur        = r.data.id_meilleur        ?? '';
        this.offres            = r.data.offres             ?? [];
        // Resync serveur — source de vérité
        this.secondesRestantes = r.data.secondes_restantes ?? 0;
        this.sessionTerminee   = r.data.statut === 'terminee';

        if (this.sessionTerminee) this.stopIntervals();
      },
      error: () => {
        this.snack.open('Impossible de charger la session.', 'Fermer', { duration: 4000 });
      }
    });
  }

  chargerOffres(): void {
    this.api.getSession(this.sessionId).subscribe({  // un seul endpoint suffit
      next: r => {
        this.offres            = r.data.offres          ?? [];
        this.meilleureOffre    = r.data.meilleure_offre ?? 0;
        this.idMeilleur        = r.data.id_meilleur     ?? '';
        // Resync timer depuis le serveur à chaque poll
        this.secondesRestantes = r.data.secondes_restantes ?? 0;

        if (r.data.statut === 'terminee') {
          this.sessionTerminee = true;
          this.stopIntervals();
        }
      }
    });
  }

  placerOffre(): void {
    if (!this.auth.estConnecte) {
      this.router.navigate(['/connexion']);
      return;
    }

    const minimum = this.meilleureOffre + (this.session?.montant_min_surenchere ?? 1000);

    // Validation surenchère minimum
    if (!this.monOffre || this.monOffre < minimum) {
      this.snack.open(
        `Offre minimum : ${this.formatFCFA(minimum)}`,
        'Fermer',
        { duration: 3000 }
      );
      return;
    }

    // Vérification locale que la session est encore active
    if (this.secondesRestantes <= 0 || this.sessionTerminee) {
      this.snack.open('Cette enchère est clôturée.', 'Fermer', { duration: 3000 });
      return;
    }

    this.chargement = true;
    this.api.placerOffre(this.sessionId, this.monOffre).subscribe({
      next: (res) => {
        this.snack.open('Offre enregistrée !', '', {
          duration: 2000,
          panelClass: 'snack-success'
        });
        this.monOffre   = 0;
        this.chargement = false;
        this.chargerOffres();
      },
      error: (err) => {
        this.snack.open(
          err.error?.message ?? 'Erreur',
          'Fermer',
          { duration: 4000, panelClass: 'snack-error' }
        );
        this.chargement = false;
      }
    });
  }

  // Getter : session chargée ET active
  get sessionActive(): boolean {
    return this.secondesRestantes > 0 && !this.sessionTerminee;
  }

  get timerFormate(): string {
    if (this.secondesRestantes < 0) return '--:--:--';
    const h = Math.floor(this.secondesRestantes / 3600);
    const m = Math.floor((this.secondesRestantes % 3600) / 60);
    const s = this.secondesRestantes % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
