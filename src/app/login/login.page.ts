import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController, Platform, AlertController } from '@ionic/angular';
import { ToastService } from '../shared/service/toast.service';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public data: any;
  public error: any;
  public loading: true;
  public username: String;
  public password: String;
  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    private toastService: ToastService,
    private apollo: Apollo,
    public storage: Storage,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private alertController: AlertController) {
    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get('username_storage').then(username => {
        if (username !== null) {
          this.storage.get('password_storage').then(password => {
            this.login_save(username, password);
          });
        }
        else {
          console.log('Display Login Form');
        }
      });
    });
  }
  login_save(username, password) {
    this.apollo.use("auth").mutate({
      mutation: gql`mutation($username: String!, $password: String!, $long_lived: Boolean!){
              login(username: $username, password: $password, long_lived: $long_lived){
                  token
              }
          }`,
      variables: {
        username: username,
        password: password,
        long_lived: true
      }
    }).subscribe(({ data, loading, error }) => {
      this.data = data;
      this.loading = loading;
      this.error = error;
      if (this.data != null) {
        this.toastService.presentToast("Đăng nhập thành công");
        this.storage.set('token', this.data.login.token);
        this.router.navigate(['/main/tabs']);
        this.router.navigate(['/main/tabs/tab3']);
      }
    }, error => {
      // this.presentToast("Sai tên đăng nhập hoặc mật khẩu");
      this.toastService.presentErrorToast("Sai tên đăng nhập hoặc mật khẩu");
    });
  }

  login() {
    console.log(this.loginForm.value);
    this.apollo.use("auth").mutate({
      mutation: gql`mutation($username: String!, $password: String!, $long_lived: Boolean!){
      login(username: $username, password: $password, long_lived: $long_lived){
          token
        }
      }`,
      variables: {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
        long_lived: true
      }
    }).subscribe(async ({ data, loading, error }) => {
      this.data = data;
      this.loading = loading;
      this.error = error;
      if (this.data) {
        console.log("Đăng nhập thành công");
        this.toastService.presentToast("Đăng nhập thành công");
        console.log("token: " + this.data.login.token);
        this.router.navigate(['/main/tabs']);
        // this.navCtrl.goForward('/tabs');
        const alert = await this.alertController.create({
          header: 'Thông báo',
          message: 'Tải lại app để đồng bộ dữ liệu',
          buttons: [{
            text: "Đồng ý",
            handler: () => {
            }
          }]
        });
        await alert.present();
      }
      this.storage.set("username_storage", this.loginForm.value.username);
      this.storage.set("password_storage", this.loginForm.value.password);
      this.storage.set('token', this.data.login.token);
    }, error => {
      this.toastService.presentErrorToast("Sai tên đăng nhập hoặc mật khẩu");
    });
  }

  ngOnInit() {
    
  }
}
