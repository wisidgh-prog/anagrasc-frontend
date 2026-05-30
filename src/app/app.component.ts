import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SGEA';
   constructor(private auth: AuthService) {}

  // estAdmin(): boolean { return this.auth.role === 'administrateur'; }
  // estCommissaire(): boolean { return this.auth.role === 'commissaire_priseur'; }
  // estSuperviseur(): boolean { return this.auth.role === 'superviseur'; }
  // estEncherisseur(): boolean { return this.auth.role === 'encherisseur'; }
roleInterne(): boolean {
    const role = this.auth.role;
    return role === 'administrateur' ||
           role === 'commissaire_priseur' ||
           role === 'superviseur' ||
           role === 'encherisseur';
  }

}
