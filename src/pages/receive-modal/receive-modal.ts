import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';

import { AccountDataProvider } from '../../providers/account-data/account-data';

/**
 * Generated class for the ReceiveModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-receive-modal',
  templateUrl: 'receive-modal.html',
})
export class ReceiveModalPage {
  qrCode: string;
  accountID: string;
  value : string = 'Techiediaries';

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountData: AccountDataProvider, public viewCtrl: ViewController, private clipboard: Clipboard, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.accountID = this.accountData.getAccountID();
  }

  copyAccount() {
  	this.clipboard.copy(this.accountID);
  	this.showToast('Address copied to clipboard');
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
