import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastService {

  constructor(public toastController: ToastController) {}

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      position: 'bottom',
      duration: 2000,
      cssClass: 'toast-success'
    });
    toast.present();
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      position: 'top',
      duration: 2000,
      cssClass: 'toast-error'
    });
    toast.present();
  }

}
