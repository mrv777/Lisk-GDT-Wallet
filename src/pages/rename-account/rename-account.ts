import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { AccountDataProvider } from '../../providers/account-data/account-data';

/**
 * Generated class for the RenameAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rename-account',
  templateUrl: 'rename-account.html',
})
export class RenameAccountPage {
  name: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public accountData: AccountDataProvider) {
  }

  ionViewDidLoad() {
    this.name = this.accountData.getAccountName();
  }

  editAccount(){
	this.accountData.editAccountName(this.name).then(() => {
	  this.viewCtrl.dismiss();
	});
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
