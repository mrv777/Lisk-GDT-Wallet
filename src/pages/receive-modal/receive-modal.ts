import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountData: AccountDataProvider, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.accountID = this.accountData.getAccountID();
    this.generateQRCode();
  }

  generateQRCode() {

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
