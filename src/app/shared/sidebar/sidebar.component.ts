import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  role: string = '';
  isOpen = true;                // état d'ouverture
  menus: { section: string, liens: { route: string, icon: string, label: string }[] }[] = [];

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(u => {
      if (u) {
        this.role = u.role;
        this.construireMenu();
      }
    });
    this.role = this.auth.role;
    this.construireMenu();
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  construireMenu(): void {
    switch (this.role) {
      case 'administrateur':
        this.menus = [
          {
            section: 'Pilotage',
            liens: [
              { route: '/admin', icon: 'grid_view', label: 'Vue d\'ensemble' },
              { route: '/admin/utilisateurs', icon: 'people', label: 'Utilisateurs' },
              { route: '/admin/gestion-biens', icon: 'inventory_2', label: 'Gestion des biens' },
              { route: '/admin/roles', icon: 'admin_panel_settings', label: 'Rôles' },
            ]
          },
          {
            section: 'Traçabilité',
            liens: [
              { route: '/admin/logs', icon: 'article', label: 'Logs' },
            ]
          },
          {
            section: 'Système',
            liens: [
              { route: '/admin/configuration', icon: 'settings', label: 'Configuration' },
            ]
          }
        ];
        break;

      case 'commissaire_priseur':
        this.menus = [
          {
            section: 'Principal',
            liens: [
              { route: '/commissaire', icon: 'grid_view', label: 'Vue d\'ensemble' },
            ]
          },
          {
            section: 'Gestion',
            liens: [
              { route: '/commissaire/biens', icon: 'inventory_2', label: 'Mes biens' },
              { route: '/commissaire/sessions', icon: 'calendar_month', label: 'Sessions' },
            ]
          },
          {
            section: 'Enchères',
            liens: [
              { route: '/commissaire/incidents', icon: 'warning', label: 'Incidents' },
            ]
          }
        ];
        break;

      case 'superviseur':
        this.menus = [
          {
            section: 'Principal',
            liens: [
              { route: '/superviseur', icon: 'grid_view', label: 'Vue d\'ensemble' },
            ]
          },
          {
            section: 'Enchères',
            liens: [
              { route: '/superviseur', icon: 'sensors', label: 'Mes sessions' },
            ]
          }
        ];
        break;

      case 'encherisseur':
        this.menus = [
          {
            section: 'Mon espace',
            liens: [
              { route: '/mon-espace', icon: 'dashboard', label: 'Tableau de bord' },
              { route: '/mon-espace/wallet', icon: 'account_balance_wallet', label: 'Mon portefeuille' },
              { route: '/mon-espace/participations', icon: 'history', label: 'Mes participations' },
            ]
          },
          {
            section: 'Enchères',
            liens: [
              { route: '/catalogue', icon: 'gavel', label: 'Catalogue' },
              { route: '/ventes-passees', icon: 'archive', label: 'Historique' },
            ]
          }
        ];
        break;
    }
  }

  estActif(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  deconnecter(): void {
    this.auth.logout();
  }
  getInitiales(): string {
  switch (this.role) {
    case 'commissaire_priseur': return 'CP';
    case 'superviseur': return 'SV';
    case 'encherisseur': return 'EN';
    default: return '??';
  }
}

getRoleName(): string {
  switch (this.role) {
    case 'commissaire_priseur': return 'Commissaire';
    case 'superviseur': return 'Superviseur';
    case 'encherisseur': return 'Enchérisseur';
    default: return '';
  }
}
}
