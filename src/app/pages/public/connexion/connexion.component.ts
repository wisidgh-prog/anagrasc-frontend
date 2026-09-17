import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {
  connexionForm: FormGroup;
  chargement = false;
  masquerMdp = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.connexionForm = this.fb.group({
      identifiant: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  seConnecter(): void {
    if (this.connexionForm.invalid) {
      this.snackbar.open('Veuillez remplir tous les champs correctement.', 'Fermer', { duration: 3000 });
      return;
    }
    this.chargement = true;
    this.auth.login(
      this.connexionForm.value.identifiant,
      this.connexionForm.value.password
    ).subscribe({
      next: (res) => {
        const r = res.user.role;
        if      (r === 'encherisseur')        this.router.navigate(['/mon-espace']);
        else if (r === 'commissaire_priseur') this.router.navigate(['/commissaire']);
        else if (r === 'superviseur')         this.router.navigate(['/superviseur']);
        else if (r === 'administrateur')      this.router.navigate(['/admin']);
        else this.router.navigate(['/']);
      },
      error: (err) => {
        this.snackbar.open(
          err.error?.message ?? 'Identifiants incorrects.',
          'Fermer',
          { duration: 4000, panelClass: 'snack-error' }
        );
        this.chargement = false;
      }
    });
  }
}
