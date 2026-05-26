import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-create-internal-user-dialog',
  templateUrl: './create-internal-user-dialog.component.html',
  styleUrls: ['./create-internal-user-dialog.component.scss']
})
export class CreateInternalUserDialogComponent {
  form: FormGroup;
  chargement = false;
   masquerMdp = true;
  erreur = '';

  rolesDisponibles = [
    { valeur: 'commissaire_priseur', libelle: 'Commissaire-priseur' },
    { valeur: 'superviseur', libelle: 'Superviseur' },
    { valeur: 'administrateur', libelle: 'Administrateur' }
  ];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<CreateInternalUserDialogComponent>
  ) {
    this.form = this.fb.group({
      role: ['administrateur', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email: ['', Validators.email],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    const pwd = g.get('password')?.value;
    const confirm = g.get('password_confirmation')?.value;
    return pwd === confirm ? null : { mismatch: true };
  }

  creer(): void {
    if (this.form.invalid) { return; }
    this.chargement = true;
    this.erreur = '';
    const data = { ...this.form.value };
    delete data.password_confirmation;
    this.api.creerCompteInterne(data).subscribe({
      next: (res) => {
        this.dialogRef.close(true); // signale le succès
      },
      error: (err) => {
        this.erreur = err.error?.message ?? 'Erreur lors de la création';
        this.chargement = false;
      }
    });
  }

  fermer(): void {
    this.dialogRef.close(false);
  }

}
