import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard }   from './core/guards/auth.guard';
import { roleGuard }   from './core/guards/role.guard';
import { AccueilComponent }      from './pages/public/accueil/accueil.component';
import { CatalogueComponent }    from './pages/public/catalogue/catalogue.component';
import { EnchereLiveComponent }  from './pages/public/enchere-live/enchere-live.component';
import { VentesPasseesComponent }from './pages/public/ventes-passees/ventes-passees.component';
import { ConnexionComponent }    from './pages/public/connexion/connexion.component';
import { InscriptionComponent }  from './pages/public/inscription/inscription.component';
import { ConditionsComponent }   from './pages/public/conditions/conditions.component';
import { DashboardEncherisseurComponent } from './pages/encherisseur/dashboard/dashboard.component';
import { WalletComponent }       from './pages/encherisseur/wallet/wallet.component';
import { ParticipationsComponent }from './pages/encherisseur/participations/participations.component';
import { DashboardCommissaireComponent } from './pages/commissaire/dashboard/dashboard.component';
import { BiensComponent }        from './pages/commissaire/biens/biens.component';
import { SessionsComponent }     from './pages/commissaire/sessions/sessions.component';
import { IncidentsComponent }    from './pages/commissaire/incidents/incidents.component';
import { DashboardSuperviseurComponent } from './pages/superviseur/dashboard/dashboard.component';
import { SupervisionComponent }  from './pages/superviseur/supervision/supervision.component';
import { DashboardAdminComponent }from './pages/admin/dashboard/dashboard.component';
import { UtilisateursComponent } from './pages/admin/utilisateurs/utilisateurs.component';
import { LogsComponent }         from './pages/admin/logs/logs.component';
import { ConfigurationComponent }from './pages/admin/configuration/configuration.component';
import { RolesComponent } from './pages/admin/roles/roles.component';

const routes: Routes = [
  { path: '',                  component: AccueilComponent },
  { path: 'catalogue',         component: CatalogueComponent },
  { path: 'encheres/:id/live', component: EnchereLiveComponent },
  { path: 'ventes-passees',    component: VentesPasseesComponent },
  { path: 'connexion',         component: ConnexionComponent },
  { path: 'inscription',       component: InscriptionComponent },
  { path: 'conditions',        component: ConditionsComponent },

  // Enchérisseur
  { path: 'mon-espace', canActivate: [authGuard, roleGuard],
    data: { roles: ['encherisseur'] },
    children: [
      { path: '',               component: DashboardEncherisseurComponent },
      { path: 'wallet',         component: WalletComponent },
      { path: 'participations', component: ParticipationsComponent },
    ]},

  // Commissaire
  { path: 'commissaire', canActivate: [authGuard, roleGuard],
    data: { roles: ['commissaire_priseur'] },
    children: [
      { path: '',          component: DashboardCommissaireComponent },
      { path: 'biens',     component: BiensComponent },
      { path: 'sessions',  component: SessionsComponent },
      { path: 'incidents', component: IncidentsComponent },
    ]},

  // Superviseur
  { path: 'superviseur', canActivate: [authGuard, roleGuard],
    data: { roles: ['superviseur'] },
    children: [
      { path: '',            component: DashboardSuperviseurComponent },
      { path: 'session/:id', component: SupervisionComponent },
    ]},

  // Admin
  { path: 'admin', canActivate: [authGuard, roleGuard],
    data: { roles: ['administrateur'] },
    children: [
      { path: '',              component: DashboardAdminComponent },
      { path: 'utilisateurs',  component: UtilisateursComponent },
      { path: 'logs',          component: LogsComponent },
      { path: 'configuration', component: ConfigurationComponent },
      { path: 'roles', component: RolesComponent }
    ]},

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
