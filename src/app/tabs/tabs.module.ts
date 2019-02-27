import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { FcmService } from '../shared/service/fcm.service';
import { ToastService } from '../shared/service/toast.service';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

const config = {
  // apiKey: "AIzaSyDUP9HaLaMDiPvIzagIA5RQ7V-sR7YnwO4",
  apiKey: "AIzaSyCReERRlwj_a5DLGZYMtoMmYpYvmBn6vHA",
  authDomain: "mplatform-production.firebaseapp.com",
  databaseURL: "https://mplatform-production.firebaseio.com",
  projectId: "mplatform-production",
  storageBucket: "mplatform-production.appspot.com",
  messagingSenderId: "1091986505942"
};

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
  ],
  declarations: [TabsPage],
  providers: [
    FcmService,
    ToastService,
  ]
})
export class TabsPageModule {}
