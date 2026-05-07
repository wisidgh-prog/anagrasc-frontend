import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar-superviseur',
  templateUrl: './sidebar-superviseur.component.html',
  styleUrls: ['../sidebar-commissaire/sidebar-commissaire.component.scss']
})
export class SidebarSuperviseurComponent {
  constructor(private router: Router, private auth: AuthService) {}

  estActif(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  deconnecter(): void {
    this.auth.logout();
  }
}
