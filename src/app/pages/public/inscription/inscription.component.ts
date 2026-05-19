import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {
  @ViewChild('stepper') stepper!: MatStepper;

  inscriptionForm: FormGroup;

  // Sous‑groupes pour les informations spécifiques
  physiqueGroup: FormGroup;
  moraleGroup: FormGroup;

  chargement = false;
  succes = '';
  masquerMdp = true;
  pieceRectoFichier: File | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private snack: MatSnackBar
  ) {
    // Initialisation des sous‑groupes
    this.physiqueGroup = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      date_naissance: ['', Validators.required],
      lieu_naissance: ['', Validators.required]
    });

    this.moraleGroup = this.fb.group({
      raison_sociale: ['', Validators.required],
      num_rccm: ['', Validators.required],
      num_ifu: [''],
      representant_legal_nom: ['', Validators.required],
      representant_legal_prenom: ['', Validators.required],
      representant_legal_date_naissance: ['', Validators.required],
      representant_legal_lieu_naissance: ['', Validators.required],
      representant_legal_fonction: ['', Validators.required]
    });

    // Formulaire principal (champs communs + groupe actif)
    this.inscriptionForm = this.fb.group({
      type_personne: ['physique', Validators.required],
      telephone: ['+226', [Validators.required, Validators.pattern(/^\+226\d{8}$/)]],
      email: ['', [Validators.email]],
      ville: ['', Validators.required],
      type_piece: ['cnib', Validators.required],
      num_piece: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
      // On ajoute les deux sous‑groupes dans le formulaire principal
      physique: this.physiqueGroup,
      morale: this.moraleGroup
    }, { validators: this.passwordMatchValidator });

    // Réagir au changement de type de personne
    this.inscriptionForm.get('type_personne')?.valueChanges.subscribe(type => {
      this.activerSousGroupe(type);
    });

    // Activer le groupe par défaut
    this.activerSousGroupe('physique');
  }

  /** Active un sous‑groupe et désactive l'autre */
  private activerSousGroupe(type: string): void {
    if (type === 'physique') {
      this.physiqueGroup.enable();
      this.moraleGroup.disable();
    } else {
      this.moraleGroup.enable();
      this.physiqueGroup.disable();
    }
  }

  passwordMatchValidator(g: FormGroup) {
    const pwd = g.get('password')?.value;
    const confirm = g.get('password_confirmation')?.value;
    return pwd === confirm ? null : { mismatch: true };
  }

  onFichierRecto(e: any): void {
    this.pieceRectoFichier = e.target.files[0];
  }

  soumettre(): void {
    if (this.inscriptionForm.invalid) {
      this.snack.open('Veuillez corriger les erreurs du formulaire.', 'Fermer', { duration: 3000 });
      return;
    }
    this.chargement = true;

    // Construire le FormData avec les champs communs + ceux du groupe actif
    const fd = new FormData();
    const valeur = this.inscriptionForm.value;
    const type = valeur.type_personne;

    // Champs communs
    fd.append('type_personne', type);
    fd.append('telephone', valeur.telephone);
    fd.append('email', valeur.email || '');
    fd.append('ville', valeur.ville);
    fd.append('type_piece', valeur.type_piece);
    fd.append('num_piece', valeur.num_piece);
    fd.append('password', valeur.password);
    fd.append('password_confirmation', valeur.password_confirmation);

    // Champs spécifiques
    const groupeActif = type === 'physique' ? this.physiqueGroup.value : this.moraleGroup.value;
    Object.keys(groupeActif).forEach(key => {
      fd.append(key, groupeActif[key] ?? '');
    });

    if (this.pieceRectoFichier) {
      fd.append('piece_recto', this.pieceRectoFichier);
    }

    this.api.inscrire(fd).subscribe({
      next: (res) => {
        this.succes = res.message;
        this.chargement = false;
      },
      error: (err) => {
        const msgs = err.error?.errors
          ? Object.values(err.error.errors).flat().join(' — ')
          : err.error?.message ?? 'Erreur';
        this.snack.open(msgs as string, 'Fermer', { duration: 15000, panelClass: 'snack-error' });
        this.chargement = false;
      }
    });
  }
}
