import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss']
})
export class ConditionsComponent implements OnInit, OnDestroy {
  sectionActive = 'inscription';
  private scrollListener!: () => void;

  menuItems = [
    { id: 'inscription',     label: 'Inscription' },
    { id: 'wallet',          label: 'Portefeuille (Wallet)' },
    { id: 'caution',         label: 'Caution' },
    { id: 'enchere',         label: 'Déroulement enchères' },
    { id: 'paiement',        label: 'Paiement et frais' },
    { id: 'defaillance',     label: 'Défaillance' },
    { id: 'confidentialite', label: 'Confidentialité' }
  ];

  ngOnInit(): void {
    this.scrollListener = this.onScroll.bind(this);
    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
  }

  onScroll(): void {
    const sections = this.menuItems.map(m => document.getElementById(m.id));
    const scrollPos = window.scrollY + 120; // décalage pour tenir compte du header

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = sections[i];
      if (el && el.offsetTop <= scrollPos) {
        this.sectionActive = this.menuItems[i].id;
        break;
      }
    }
  }

  allerSection(id: string): void {
    this.sectionActive = id;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
