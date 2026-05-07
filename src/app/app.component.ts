import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'anagrasc-frontend';
   constructor(private auth: AuthService) {}

  estAdmin(): boolean { return this.auth.role === 'administrateur'; }
  estCommissaire(): boolean { return this.auth.role === 'commissaire_priseur'; }
  estSuperviseur(): boolean { return this.auth.role === 'superviseur'; }
}
