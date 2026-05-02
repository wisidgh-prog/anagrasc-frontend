import { NgModule } from '@angular/core';

import { MatToolbarModule }    from '@angular/material/toolbar';
import { MatButtonModule }     from '@angular/material/button';
import { MatIconModule }       from '@angular/material/icon';
import { MatCardModule }       from '@angular/material/card';
import { MatInputModule }      from '@angular/material/input';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatSelectModule }     from '@angular/material/select';
import { MatTableModule }      from '@angular/material/table';
import { MatPaginatorModule }  from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule }   from '@angular/material/snack-bar';
import { MatDialogModule }     from '@angular/material/dialog';
import { MatChipsModule }      from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule }      from '@angular/material/badge';
import { MatMenuModule }       from '@angular/material/menu';
import { MatDividerModule }    from '@angular/material/divider';
import { MatListModule }       from '@angular/material/list';
import { MatStepperModule }    from '@angular/material/stepper';
import { MatTooltipModule }    from '@angular/material/tooltip';
import { MatSortModule }       from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


const MATERIAL_MODULES = [
  MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule,
  MatInputModule, MatFormFieldModule, MatSelectModule, MatTableModule,
  MatPaginatorModule, MatProgressSpinnerModule, MatSnackBarModule,
  MatDialogModule, MatChipsModule, MatProgressBarModule, MatBadgeModule,
  MatMenuModule, MatDividerModule, MatListModule, MatStepperModule,
  MatTooltipModule, MatSortModule, MatDatepickerModule, MatNativeDateModule
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class MaterialModule {}
