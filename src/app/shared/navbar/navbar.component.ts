import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  utilisateur: any = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(u => this.utilisateur = u);
  }

  get estConnecte(): boolean { return this.auth.estConnecte; }
  get role(): string         { return this.auth.role; }
  deconnecter(): void        { this.auth.logout(); }
}
