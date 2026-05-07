import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  utilisateur: any = null;
  private userSubscription!: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.userSubscription = this.auth.currentUser$.subscribe(u => {
      this.utilisateur = u;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  get estConnecte(): boolean { return this.auth.estConnecte; }
  get role(): string         { return this.auth.role; }
  deconnecter(): void        { this.auth.logout(); }
}
