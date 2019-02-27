import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';

import { FcmService } from './shared/service/fcm.service';
import { ToastService } from './shared/service/toast.service';
// import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Network } from '@ionic-native/network/ngx';

const config = {
  apiKey: "AIzaSyDUP9HaLaMDiPvIzagIA5RQ7V-sR7YnwO4",
  authDomain: "mplatform-production.firebaseapp.com",
  databaseURL: "https://mplatform-production.firebaseio.com",
  projectId: "mplatform-production",
  storageBucket: "mplatform-production.appspot.com",
  messagingSenderId: "1091986505942"
};
@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    HttpLinkModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ApolloModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    FcmService,
    ToastService,
    SQLite,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor( 
    apollo: Apollo,
    httpLink: HttpLink,
    public storage: Storage
  ) {
    const domain = "http://app.mimosatek.com/api"; // stagging
    // const domain = "http://mplatform.mimosatek.com/api"; // dev
    apollo.create({
      link: httpLink.create({ uri: domain + '/auth' }),
      cache: new InMemoryCache() as any,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      }
    }, "auth");

    this.storage.get('token').then((val) => {
      apollo.create({
        link: httpLink.create({
          uri: domain + '/monitor',
          headers: new HttpHeaders().set("authorization", val)
        }),
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'network-only',
            errorPolicy: 'ignore',
          },
          query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
          },
        }
      }, "monitor");
    });
    apollo.create({
      link: httpLink.create({
        uri: domain + '/insight',
        headers: new HttpHeaders().set("Content-Type", "application/json; charset=utf-8")
      }),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      }
    }, "insight");
  }
}
