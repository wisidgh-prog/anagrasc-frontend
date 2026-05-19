import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule }  from './app-routing.module';
import { AppComponent }      from './app.component';
import { MaterialModule }    from './shared/material/material.module';
import { AuthInterceptor }   from './core/interceptors/auth.interceptor';

import { NavbarComponent }   from './shared/navbar/navbar.component';
import { ConnexionComponent }from './pages/public/connexion/connexion.component';
import { InscriptionComponent } from './pages/public/inscription/inscription.component';
import { AccueilComponent }  from './pages/public/accueil/accueil.component';
import { CatalogueComponent }from './pages/public/catalogue/catalogue.component';
import { EnchereLiveComponent } from './pages/public/enchere-live/enchere-live.component';
import { VentesPasseesComponent } from './pages/public/ventes-passees/ventes-passees.component';
import { ConditionsComponent } from './pages/public/conditions/conditions.component';
import { DashboardEncherisseurComponent } from './pages/encherisseur/dashboard/dashboard.component';
import { WalletComponent }   from './pages/encherisseur/wallet/wallet.component';
import { ParticipationsComponent } from './pages/encherisseur/participations/participations.component';
import { DashboardCommissaireComponent } from './pages/commissaire/dashboard/dashboard.component';
import { BiensComponent }    from './pages/commissaire/biens/biens.component';
import { SessionsComponent } from './pages/commissaire/sessions/sessions.component';
import { IncidentsComponent }from './pages/commissaire/incidents/incidents.component';
import { DashboardSuperviseurComponent } from './pages/superviseur/dashboard/dashboard.component';
import { SupervisionComponent } from './pages/superviseur/supervision/supervision.component';
import { DashboardAdminComponent } from './pages/admin/dashboard/dashboard.component';
import { UtilisateursComponent } from './pages/admin/utilisateurs/utilisateurs.component';
import { LogsComponent }     from './pages/admin/logs/logs.component';
import { ConfigurationComponent } from './pages/admin/configuration/configuration.component';
import{TimerComponent} from './shared/timer/timer.component';
import { SidebarCommissaireComponent } from './shared/sidebar-commissaire/sidebar-commissaire.component';
import { SidebarSuperviseurComponent } from './shared/sidebar-superviseur/sidebar-superviseur.component';
import { SidebarAdminComponent } from './shared/sidebar-admin/sidebar-admin.component';
import { RolesComponent } from './pages/admin/roles/roles.component';

@NgModule({
   declarations: [
     AppComponent,
      NavbarComponent,
     ConnexionComponent,
     InscriptionComponent,
      AccueilComponent,
     CatalogueComponent,
     EnchereLiveComponent,
      VentesPasseesComponent,
     ConditionsComponent,
     DashboardEncherisseurComponent,
      WalletComponent,
       ParticipationsComponent,
     DashboardCommissaireComponent,
      BiensComponent,
       SessionsComponent,
     IncidentsComponent,
      DashboardSuperviseurComponent,
       SupervisionComponent,
     DashboardAdminComponent,
      UtilisateursComponent,
       LogsComponent,
     ConfigurationComponent,
     SidebarAdminComponent,
     SidebarCommissaireComponent,
     SidebarSuperviseurComponent,
     TimerComponent,
     RolesComponent
   ],
   imports: [
     BrowserModule,
     BrowserAnimationsModule,
     CommonModule,
     AppRoutingModule,
     HttpClientModule,
     FormsModule,
     ReactiveFormsModule,
     MaterialModule,
   ],
   providers: [{
     provide : HTTP_INTERCEPTORS,
     useClass: AuthInterceptor,
     multi   : true,
   }],
   bootstrap: [AppComponent],
})
export class AppModule {}
