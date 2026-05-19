import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss']
})
export class UtilisateursComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  colonnes = ['nom', 'telephone', 'type', 'role', 'statut', 'actions'];
  filtres = { est_valide: '', role: '', search: '' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: ApiService, private snack: MatSnackBar) {}

  ngOnInit(): void { this.charger(); }

  charger(): void {
    this.api.getUtilisateurs(this.filtres).subscribe({
      next: r => {
        this.dataSource = new MatTableDataSource(r.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  filtrerTable(e: Event): void {
    this.dataSource.filter = (e.target as HTMLInputElement).value.trim().toLowerCase();
  }

  valider(id: number): void {
    this.api.validerCompte(id).subscribe({
      next: r => {
        this.snack.open(r.message, '', { duration: 13000, panelClass: 'snack-success' });
        this.charger();
      },
      error: e => this.snack.open(e.error?.message ?? 'Erreur', 'Fermer', { duration: 13000, panelClass: 'snack-error' })
    });
  }
//rejeter 
  rejeter(id: number): void {
    const motif = prompt('Motif du rejet :');
    if (!motif) return;
    this.api.rejeterCompte(id, motif).subscribe({
      next: r => {
        this.snack.open(r.message, '', { duration: 3000, panelClass: 'snack-success' });
        this.charger();
      },
      error: e => this.snack.open(e.error?.message ?? 'Erreur', 'Fermer', { duration: 3000, panelClass: 'snack-error' })
    });
  }

  suspendre(id: number): void {
    const motif = prompt('Motif de la suspension :');
    if (!motif) return;
    this.api.suspendrCompte(id, motif).subscribe({
      next: r => {
        this.snack.open(r.message, '', { duration: 3000, panelClass: 'snack-success' });
        this.charger();
      },
      error: e => this.snack.open(e.error?.message ?? 'Erreur', 'Fermer', { duration: 3000, panelClass: 'snack-error' })
    });
  }
}
