import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { AccountDataProvider } from '../../providers/account-data/account-data';
import { RenameAccountPage } from '../rename-account/rename-account';

/**
 * Generated class for the AccountMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-menu',
  templateUrl: 'account-menu.html',
})
export class AccountMenuPage {
  hasPassphrase: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public accountData: AccountDataProvider, public modalCtrl: ModalController,) {
  }

  ionViewDidLoad() {
    this.hasPassphrase = this.accountData.hasSavedPassword();
  }

  removeAccount() {
    this.accountData.removeCurrentAccount().then(() => {
      this.viewCtrl.dismiss('remove');
    });
  }

  savePassphrase() {

  }

  removePassphrase() {
  	this.accountData.removeSavedPssword().then(() => {
  		this.viewCtrl.dismiss('passphraseRemoved');
  	});
  }

  editAccount() {
    let myModal = this.modalCtrl.create(RenameAccountPage);
    myModal.present();
    myModal.onDidDismiss(data => {
      // this.loadContacts();
      this.viewCtrl.dismiss();
    });
  }

}
