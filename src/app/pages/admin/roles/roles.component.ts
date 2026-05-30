import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: any[] = [];
  roleForm: FormGroup;
  modeModification = false;
  roleSelectionne: any = null;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private snack: MatSnackBar
  ) {
    this.roleForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      est_actif: [true]
    });
  }

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.api.getRoles().subscribe({
      next: (res) => this.roles = res.data ?? [],
      error: (err) => console.error(err)
    });
  }

  ouvrirAjout(): void {
    this.modeModification = false;
    this.roleSelectionne = null;
    this.roleForm.reset({ nom: '', description: '', est_actif: true });
  }

  ouvrirModification(role: any): void {
    this.modeModification = true;
    this.roleSelectionne = role;
    this.roleForm.patchValue({
      nom: role.nom,
      description: role.description,
      est_actif: role.est_actif
    });
  }

  annuler(): void {
    this.modeModification = false;
    this.roleSelectionne = null;
  }

  soumettre(): void {
    if (this.roleForm.invalid) return;

    const data = this.roleForm.value;

    if (this.modeModification) {
      this.api.modifierRole(this.roleSelectionne.id, data).subscribe({
        next: (res) => {
          this.snack.open(res.message, 'Fermer', { duration: 3000 });
          this.annuler();
          this.charger();
        },
        error: (err) => this.snack.open(err.error?.message ?? 'Erreur', 'Fermer', { duration: 3000 })
      });
    } else {
      this.api.creerRole(data).subscribe({
        next: (res) => {
          this.snack.open(res.message, 'Fermer', { duration: 3000 });
          this.charger();
          this.roleForm.reset({ nom: '', description: '', est_actif: true });
        },
        error: (err) => this.snack.open(err.error?.message ?? 'Erreur', 'Fermer', { duration: 3000 })
      });
    }
  }

  supprimer(id: number): void {
    if (!confirm('Supprimer ce rôle ?')) return;
    this.api.supprimerRole(id).subscribe({
      next: (res) => {
        this.snack.open(res.message, 'Fermer', { duration: 3000 });
        this.charger();
      },
      error: (err) => this.snack.open(err.error?.message ?? 'Erreur', 'Fermer', { duration: 3000 })
    });
  }
}
