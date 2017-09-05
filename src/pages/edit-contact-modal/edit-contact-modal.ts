import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { AccountDataProvider } from '../../providers/account-data/account-data';

/**
 * Generated class for the EditContactModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-contact-modal',
  templateUrl: 'edit-contact-modal.html',
})
export class EditContactModalPage {
  account: string;
  startingAccount: string;
  name: string;
  title: string;
  buttonText: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public accountData: AccountDataProvider) {
    this.name = navParams.get('name');
    this.account = navParams.get('account');
    this.startingAccount = navParams.get('account');
    if (this.account == '') {
      this.title = 'Add Contact';
      this.buttonText = 'Add';
    } else {
      this.title = 'Edit Contact';
      this.buttonText = 'Edit';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditContactModalPage');
  }

  editContact(){
    if (this.title == 'Edit Contact') {
      this.accountData.editContact(this.name,this.account).then(() => {
        this.viewCtrl.dismiss();
      });
    } else {
      this.accountData.addContact(this.name,this.account).then(() => {
        this.viewCtrl.dismiss();
      });
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
