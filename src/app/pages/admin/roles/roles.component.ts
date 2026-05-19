import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: any[] = [];
  permissions: any[] = [];
  selectedRole: any = null;
  newRole = { nom: '', description: '' };

  constructor(private api: ApiService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.loadRoles();
    this.api.getPermissions().subscribe(res => this.permissions = res.data);
  }

  loadRoles(): void {
    this.api.getRoles().subscribe(res => {
      this.roles = res.data;
      if (this.selectedRole) {
        // rafraîchir les données du rôle sélectionné
        const updated = this.roles.find(r => r.id === this.selectedRole.id);
        if (updated) this.selectedRole = updated;
      }
    });
  }

  selectRole(role: any): void {
    this.selectedRole = { ...role, permissionsNames: role.permissions?.map((p:any) => p.id) || [] };
  }

  addRole(): void {
    this.api.creerRole(this.newRole).subscribe({
      next: () => {
        this.snack.open('Rôle créé', 'Fermer', { duration: 13000 });
        this.newRole = { nom: '', description: '' };
        this.loadRoles();
      },
      error: (err) => this.snack.open(err.error?.message || 'Erreur', 'Fermer', { duration: 13000 })
    });
  }

  saveRole(role: any): void {
    this.api.modifierRole(role.id, { nom: role.nom, description: role.description, est_actif: role.est_actif }).subscribe({
      next: () => this.snack.open('Rôle mis à jour', 'Fermer', { duration: 13000 }),
      error: (err) => this.snack.open(err.error?.message || 'Erreur', 'Fermer', { duration: 13000 })
    });
  }

  deleteRole(id: number): void {
    if (confirm('Supprimer ce rôle ?')) {
      this.api.supprimerRole(id).subscribe({
        next: () => {
          this.snack.open('Rôle supprimé', 'Fermer', { duration: 13000 });
          this.selectedRole = null;
          this.loadRoles();
        },
        error: (err) => this.snack.open(err.error?.message || 'Erreur', 'Fermer', { duration: 13000 })
      });
    }
  }

  updatePermissions(roleId: number, permIds: number[]): void {
    this.api.syncRolePermissions(roleId, permIds).subscribe({
      next: () => this.snack.open('Permissions mises à jour', 'Fermer', { duration: 13000 }),
      error: (err) => this.snack.open(err.error?.message || 'Erreur', 'Fermer', { duration: 13000 })
    });
  }
}
