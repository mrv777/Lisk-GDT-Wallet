import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
// import { Screenshot } from '@ionic-native/screenshot';

import * as bip39 from 'bip39';

import { AccountDataProvider } from '../../providers/account-data/account-data';

@IonicPage()
@Component({
  selector: 'page-new-account',
  templateUrl: 'new-account.html',
})
export class NewAccountPage {
  passphrase: string;
  accountID: string;
  saved: boolean = false;
  accountName: string = '';
  savePassphrase: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountData: AccountDataProvider, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.passphrase = bip39.generateMnemonic();
    this.accountID = this.accountData.convertPasswordToAccount(this.passphrase);
  }

  // getRandomInt(min, max) {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }

  // save() {
  // 	this.saved = true;
  //   this.screenshot.save('jpg', 80).then(res => { 
  //     console.log(res.filePath);
  //     this.showToast(`Screenshot of account and passphrase saved to your photos.`);
  //   })
  //   .catch(() => {
  //   	console.error("screenshot error");
  //   	this.showToast(`Error saving screenshot of account and passphrase.`);
  //   });
    
  // }

  // showToast(message: string) {
  //   let toast = this.toastCtrl.create({
  //     message: message,
  //     showCloseButton: true,
  //     closeButtonText: 'ok',
  //     position: 'bottom'
  //   });

  //   toast.onDidDismiss(() => {
  //     console.log('Dismissed toast');
  //   });

  //   toast.present();
  // }

  closeModal() {
  	this.accountData.saveSavedPassword(this.passphrase, this.accountID, this.accountName, this.savePassphrase);
    this.viewCtrl.dismiss(this.accountID);
  }
}
