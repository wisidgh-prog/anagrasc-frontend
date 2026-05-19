import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  /** Secondes restantes (fournies par le composant parent) */
  @Input() secondes = 0;

  /** Indique si le temps est critique (moins de 60 secondes) */
  get urgent(): boolean {
    return this.secondes <= 60;
  }

  /** Timer formaté HH:MM:SS */
  get timerFormate(): string {
    const h = Math.floor(this.secondes / 3600);
    const m = Math.floor((this.secondes % 3600) / 60);
    const s = this.secondes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  ngOnInit(): void {
    // Le composant parent est responsable de décrémenter / mettre à jour `secondes`
  }

  ngOnDestroy(): void {
    // Pas de nettoyage nécessaire
  }
}
