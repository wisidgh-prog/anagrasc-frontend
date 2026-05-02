import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  wallet: any = null;
  transactions: any[] = [];
  erreur = '';
  message = '';
  chargement = false;

  recharge = {
    montant: 0,
    mode_paiement: 'orange_money',
    telephone_paiement: ''
  };

  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.chargerWallet();
    this.chargerTransactions();
  }

  chargerWallet(): void {
    this.api.getWallet().subscribe({ next: (res) => (this.wallet = res.data) });
  }

  chargerTransactions(): void {
    this.api.getTransactions().subscribe({
      next: (res) => (this.transactions = res.data.data ?? [])
    });
  }

  recharger(): void {
    this.erreur = '';
    this.message = '';
    this.chargement = true;
    this.api.deposerWallet(this.recharge).subscribe({
      next: (res) => {
        this.message = res.message;
        this.chargement = false;
        this.chargerWallet();
        this.chargerTransactions();
      },
      error: (err) => {
        this.erreur = err.error?.message ?? 'Erreur lors de la recharge.';
        this.chargement = false;
      }
    });
  }

  libelleType(type: string): string {
    const libelles: any = {
      depot: 'Dépôt',
      prelevement_caution: 'Caution prélevée',
      remboursement_caution: 'Caution remboursée',
      paiement_final: 'Paiement final',
      penalite: 'Pénalité'
    };
    return libelles[type] ?? type;
  }

  formatFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
