import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-user-details-dialog',
  templateUrl: './user-details-dialog.component.html',
  styleUrls: ['./user-details-dialog.component.scss']
})
export class UserDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public user: any) {}

  // URL d'affichage de la pièce (recto/verso) basée sur la config du backend.
  // Route réelle : GET /api/utilisateurs/{user}/piece/{face}
  urlPiece(face: 'recto' | 'verso'): string {
    return `${environment.apiUrl}/utilisateurs/${this.user.id}/piece/${face}`;
  }
}
