import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ToastService } from '../shared/service/toast.service';
import { FcmService } from '../shared/service/fcm.service';
import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public data: any;
  public error: any;
  public loading: any;
  public farm_id: any;
  public data_activities = [];
  public data_malfunctions = [];
  public topic_activities: any[] = [];
  public topic_malfunctions: any[] = [];
  public all_topic_activities = [];
  public all_topic_malfunctions = [];
  public all_notifications = [];
  public all_notifications1 = [];
  count: number = 0;
  count_mal: number = 0;
  count_activities: number = 0;
  constructor(
    private apollo: Apollo,
    private toastService: ToastService,
    private fcm: FcmService,
    private storage: Storage,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private loadingController: LoadingController
  ) {
    this.storage.get('count').then(val => {
      this.count_activities = val;
    })
    this.storage.get('activities_topic').then(val => {
      for(let i in val){
        this.getAllData(val[i]);
      }
    });
    this.storage.get('malfunctions_topic').then(val => {
      for(let i in val){
        this.getAllData(val[i]);
      }
    })
    // this.getAllData("notifications.4322af20-e82a-11e8-9f32-f2801f1b9fd1.activities");
    // this.loadNotification("notifications.4322af20-e82a-11e8-9f32-f2801f1b9fd1.activities", 1545989513000, 1546680713000);
  }

  loadNotification(topic, start, end) {
    this.apollo.use("insight").query({
      query: gql`query ranged_search_notification($topic: String!, $start: Float!, $end: Float!) {
          ranged_search_notification(topic: $topic, start: $start, end: $end) {
            start
            end
            groups {
              label
              data {
                id
                payload {
                  topic
                  notification {
                    title
                    body
                  }
                  android {
                    icon
                    sound
                  }
                  data {
                    class
                    type
                    sensor
                    insight
                    value
                    unit
                    min
                    max
                    location_type
                    location_id
                    location_name
                    ref_id
                    ref_name
                    ts
                  }
                }
              }
            }
          }
        }`,
      variables: {
        topic: topic,
        start: start,
        end: end
      }
    }).subscribe(({ data, loading }) => {
      this.all_notifications = [];
      this.data = data;
      this.loading = loading;
      if (this.data.ranged_search_notification !== null) {
        // console.log("data" + this.data.ranged_search_notification.groups);
        this.all_notifications.push(this.data.ranged_search_notification.groups);
      }
    });
    return this.all_notifications;
  }

  loadNotification1(topic, start, end) {
    this.apollo.use("insight").query({
      query: gql`query ranged_search_notification($topic: String!, $start: Float!, $end: Float!) {
          ranged_search_notification(topic: $topic, start: $start, end: $end) {
            start
            end
            groups {
              label
              data {
                id
                payload {
                  topic
                  notification {
                    title
                    body
                  }
                  android {
                    icon
                    sound
                  }
                  data {
                    class
                    type
                    sensor
                    insight
                    value
                    unit
                    min
                    max
                    location_type
                    location_id
                    location_name
                    ref_id
                    ref_name
                    ts
                  }
                }
              }
            }
          }
        }`,
      variables: {
        topic: topic,
        start: start,
        end: end
      }
    }).subscribe(({ data, loading }) => {
      this.all_notifications1 = [];
      this.data = data;
      this.loading = loading;
      if (this.data.ranged_search_notification !== null) {
        // console.log("data" + this.data.ranged_search_notification.groups);
        this.all_notifications1.push(this.data.ranged_search_notification.groups);
      }
    });
    return this.all_notifications1;
  }

  loadMore() {
    this.count++;
    this.presentLoadingWithOptions();
    let data: any = [];
    let value_activities;
    this.storage.get('activities_topic').then(val => {
      for (let i in val) {
        let groups = this.loadNotification(val[i], Date.now() - 86400000 - 86400000 * this.count, Date.now() - 86400000 * this.count);
        if (groups !== null) {
          for (let group_id in groups) {
            for (let j in groups[group_id]) {
              data.push(groups[group_id][j].data)
            }
          }
        }
      }

      for (let a in data) {
        for (let b in data[a]) {
          if (data[a][b].payload.data.class === "activities") {
            if (data[a][b].payload.data.value === "process_end") {
              value_activities = "tắt"
            }
            if (data[a][b].payload.data.value === "process_start") {
              value_activities = "bật"
            }
            if (data[a][b].payload.data.value === "preparing") {
              value_activities = "chuẩn bị"
            }
            this.data_activities.push({
              "class": data[a][b].payload.data.class,
              "type": data[a][b].payload.data.type,
              "value": value_activities,
              "location_type": data[a][b].payload.data.location_type,
              "location_name": data[a][b].payload.data.location_name,
              "ref_name": data[a][b].payload.data.ref_name,
              "ts": data[a][b].payload.data.ts
            });
          }
        }
      }
    });
    console.log(this.data_activities);
    console.log(data);
    
  }
  loadMoreMalfunction() {
    this.count_mal++;
    this.presentLoadingWithOptions();
    let data: any = [];
    let value_malfunction;
    this.storage.get('malfunctions_topic').then((val) => {
      for (let i in val) {
        let groups = this.loadNotification1(val[i], Date.now() - 86400000 - 86400000 * this.count_mal, Date.now() - 86400000 * this.count_mal);
        if (groups !== null) {
          for (let group_id in groups) {
            for (let j in groups[group_id]) {
              data.push(groups[group_id][j].data)
            }
          }
        }
      }
      for (let a in data) {
        for (let b in data[a]) {
          if (data[a][b].payload.data.value === "low") {
            value_malfunction = "thấp"
          }
          if (data[a][b].payload.data.value === "high") {
            value_malfunction = "cao"
          }
          if (data[a][b].payload.data.value === "error") {
            value_malfunction = "lỗi"
          }
          this.data_malfunctions.push({
            "class": data[a][b].payload.data.class,
            "type": data[a][b].payload.data.type,
            "value": value_malfunction,
            "location_type": data[a][b].payload.data.location_type,
            "location_name": data[a][b].payload.data.location_name,
            "ref_name": data[a][b].payload.data.ref_name,
            "ts": data[a][b].payload.data.ts
          });
        }
      }
    });
    console.log(this.data_malfunctions);
    console.log(data);
  }

  getAllData(topic: any) {
    this.presentLoadingWithOptions();
    this.data_activities = [];
    this.data_malfunctions = [];
    let output_data = [];
    let format_data_activities: any = [];
    let format_data_malfunctions: any = [];
    let value_activity_temp: any;
    let value_malfunction_temp: any;
    let ranged_search_notification_activities: any = [];
    this.apollo.use("insight").query({
      query: gql`query ranged_search_notification($topic: String!, $start: Float!, $end: Float!) {
          ranged_search_notification(topic: $topic, start: $start, end: $end) {
            start
            end
            groups {
              label
              data {
                id
                payload {
                  topic
                  notification {
                    title
                    body
                  }
                  android {
                    icon
                    sound
                  }
                  data {
                    class
                    type
                    sensor
                    insight
                    value
                    unit
                    min
                    max
                    location_type
                    location_id
                    location_name
                    ref_id
                    ref_name
                    ts
                  }
                }
              }
            }
          }
        }`,
      variables: {
        topic: topic,
        start: Date.now() - 86400000,
        end: Date.now()
      }
    }).subscribe(({ data }) => {
      ranged_search_notification_activities = data;
      let groups = ranged_search_notification_activities.ranged_search_notification.groups;
      for (let i in groups) {
        for (let j in groups[i].data) {
          output_data.push(groups[i].data[j].payload.data);
        }
      }
      for (let z in output_data) {
        if (output_data[z].class === "activities") {
          if (output_data[z].value === "process_end") {
            value_activity_temp = "tắt"
          }
          if (output_data[z].value === "process_start") {
            value_activity_temp = "bật"
          }
          if (output_data[z].value === "process_start") {
            value_activity_temp = "chuẩn bị"
          }
          format_data_activities.push({
            "class": output_data[z].class,
            "type": output_data[z].type,
            "value": value_activity_temp,
            "location_type": output_data[z].location_type,
            "location_name": output_data[z].location_name,
            "ref_name": output_data[z].ref_name,
            "ts": output_data[z].ts
          });
          this.data_activities = format_data_activities;
        }
        else if (output_data[z].class === "malfunctions") {
          if (output_data[z].value === "low") {
            value_malfunction_temp = "thấp"
          }
          if (output_data[z].value === "high") {
            value_malfunction_temp = "cao"
          }
          if (output_data[z].value === "error") {
            value_malfunction_temp = "lỗi"
          }
          format_data_malfunctions.push({
            "class": output_data[z].class,
            "type": output_data[z].type,
            "value": value_malfunction_temp,
            "location_type": output_data[z].location_type,
            "location_name": output_data[z].location_name,
            "ref_name": output_data[z].ref_name,
            "ts": output_data[z].ts
          });
          this.data_malfunctions = format_data_malfunctions;
        }
      }
    });
  }
  async reloadMalfunctions(){
    this.storage.get('malfunctions_topic').then(val => {
      this.presentLoadingWithOptions();
      for(let i in val){
        this.getAllData(val[i]);
      }
    });
    this.storage.set('count', 0);
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: "bubbles",
      duration: 2000,
      message: 'Đang tải...',
      mode: 'ios',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  reloadActivities(){
    this.storage.get('activities_topic').then(val => {
      this.presentLoadingWithOptions();
      for(let i in val){
        this.getAllData(val[i]);
      }
    });
    this.storage.set('count', 0);
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      this.reloadMalfunctions();
      this.reloadActivities();
      event.target.complete();
    }, 500);
  }
}
