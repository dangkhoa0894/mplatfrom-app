import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Platform } from '@ionic/angular';
import { ToastService } from '../shared/service/toast.service';
import { Storage } from '@ionic/storage';
import { FcmService } from '../shared/service/fcm.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  public data: any;
  public error: any;
  public loading: any;
  public topic_activities = [];
  public topic_malfunctions = [];
  public count = 10;
  public farm_id: any;
  constructor(
    private apollo: Apollo,
    private platform: Platform,
    private toastService: ToastService,
    private storage: Storage,
    private fcm: FcmService,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.getFarmID();
    if(this.platform.is('ios')){
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      for (let i in this.topic_activities) {
        this.notificationSetup(this.topic_activities[i]);
        console.log(this.topic_activities[i]);
      } 
      for (let i in this.topic_malfunctions) {
        this.notificationSetup(this.topic_malfunctions[i]);
        console.log(this.topic_malfunctions[i]);
      }
    }
    else if(this.platform.is('android')){
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // for (let i in this.topic_activities) {
      //   this.notificationSetup(this.topic_activities[i]);
      //   console.log(this.topic_activities[i]);
      // } 
      // for (let i in this.topic_malfunctions) {
      //   this.notificationSetup(this.topic_malfunctions[i]);
      //   console.log(this.topic_malfunctions[i]);
      // }
      this.notificationSetup("khoadong");
    }
  }
  private notificationSetup(topic: string) {
    this.fcm.getToken();
    this.fcm.subscribeToTopic(topic);
    this.fcm.onNotifications().subscribe(data => {
      if (data.wasTapped) {
        console.log("Received in background");
        console.log(data);
      } else {
        console.log("Received in foreground");
        this.toastService.presentToast(data.aps.alert.body);
        this.count++;  
        console.log(data);
        this.storage.set("count", this.count);
      };
    });
  }

  getFarmID() {
    this.topic_activities = [];
    this.topic_malfunctions = [];
    this.apollo.use("monitor").query({
      query: gql`query farms {
        farms{
          id
        }
      }`
    }).subscribe(({ data, loading, errors }) => {
      this.loading = loading;
      if (data) {
        this.farm_id = data;
        // console.log(this.data.farms);
        for (let i in this.farm_id.farms) {
          this.topic_activities.push("notifications." + this.farm_id.farms[i].id + ".activities");
          this.topic_malfunctions.push("notifications." + this.farm_id.farms[i].id + ".malfunctions");
          // this.toastService.presentToast(this.farm_id.farms[i].id);
        }
        this.storage.set('activities_topic', this.topic_activities);
        this.storage.set('malfunctions_topic', this.topic_malfunctions);
      }
    }, error => {
      this.toastService.presentErrorToast("Đã có lỗi trong quá trình tải dữ liệu");
    })
  }
}
