import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ActivitiesComponent } from './activities/activities.component';
import { MalfunctionComponent } from './malfunction/malfunction.component';
import { Tab3RoutingModule } from './tab3.router.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab3RoutingModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }])
  ],
  declarations: [Tab3Page, ActivitiesComponent, MalfunctionComponent]
})
export class Tab3PageModule {}
