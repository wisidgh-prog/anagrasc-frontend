import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.scss']
})
export class SidebarAdminComponent {
  constructor(private router: Router, private auth: AuthService) {}

  estActif(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  deconnecter(): void {
    this.auth.logout();
  }
}
