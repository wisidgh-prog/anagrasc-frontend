import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {
  @ViewChild('stepper') stepper!: MatStepper;

  chargement = false;
  succes     = '';
  masquerMdp = true;

  form: any = {
    type_personne : 'physique',
    nom           : '', prenom          : '',
    date_naissance: '', lieu_naissance  : '',
    raison_sociale: '', num_rccm        : '', num_ifu: '',
    representant_legal_nom            : '',
    representant_legal_prenom         : '',
    representant_legal_date_naissance : '',
    representant_legal_lieu_naissance : '',
    representant_legal_fonction       : '',
    telephone     : '', email          : '',
    ville         : '', type_piece     : 'cnib',
    num_piece     : '', password       : '',
    password_confirmation: '',
  };

  pieceRectoFichier: File | null = null;

  constructor(
    private api    : ApiService,
    private router : Router,
    private snack  : MatSnackBar
  ) {}

  onFichierRecto(e: any): void {
    this.pieceRectoFichier = e.target.files[0];
  }

  soumettre(): void {
    this.chargement = true;
    const fd = new FormData();
    Object.keys(this.form).forEach(k => fd.append(k, this.form[k]));
    if (this.pieceRectoFichier) fd.append('piece_recto', this.pieceRectoFichier);

    this.api.inscrire(fd).subscribe({
      next: (res) => {
        this.succes     = res.message;
        this.chargement = false;
      },
      error: (err) => {
        const msgs = err.error?.errors
          ? Object.values(err.error.errors).flat().join(' — ')
          : err.error?.message ?? 'Erreur';
        this.snack.open(msgs as string, 'Fermer',
          { duration: 5000, panelClass: 'snack-error' });
        this.chargement = false;
      }
    });
  }
}
