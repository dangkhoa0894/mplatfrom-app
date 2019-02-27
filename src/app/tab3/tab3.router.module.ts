import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MalfunctionComponent } from './malfunction/malfunction.component';
import { ActivitiesComponent } from './activities/activities.component';
import { Tab3Page } from './tab3.page';

const routes: Routes = [
    {
        path: '',
        component: Tab3Page,
    },
]
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class Tab3RoutingModule { }