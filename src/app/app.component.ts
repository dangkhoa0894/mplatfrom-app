import { Component } from '@angular/core';
import { Platform, AlertController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FcmService } from './shared/service/fcm.service';
import { ToastService } from './shared/service/toast.service';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public username: String;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public alertController: AlertController,
    private router: Router,
    private storage: Storage,
    private menu: MenuController,
    private fcm: FcmService,
    private toastr: ToastService,
    private apollo: Apollo
  ) {
    this.initializeApp();
    this.storage.get('username_storage').then((val) => {
      this.username = val;
    });

  }

  private notificationSetup(topic: string) {
    this.fcm.getToken();
    this.fcm.subscribeToTopic(topic);
    this.fcm.onNotifications().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background");
        console.log(data);
      } else {
        console.log("Received in foreground");
        this.toastr.presentToast(data.aps.alert.body);
        console.log(data);
      };
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get('activities_topic1').then(activity => {
        for (let i in activity) {
          this.notificationSetup(activity[i]);
        }
      })
      this.storage.get('malfunctions_topic1').then((malfunction) => {
        for (let i in malfunction) {
          this.notificationSetup(malfunction[i]);
        }
      });
    });
  }
  async logout() {
    const alert = await this.alertController.create({
      header: 'Thông báo',
      message: 'Bạn có muốn đăng xuất và thoát ứng dụng?',
      buttons: [{
        text: "Đồng ý",
        handler: () => {
          this.storage.clear();
          this.router.navigate(['']);
          this.menu.close('aboutMenu');
        }
      }, {
        text: "Từ chối",
        role: 'cancel',
        handler: () => {
          this.menu.close('aboutMenu');
        }
      }]
    });
    await alert.present();
  }
}
