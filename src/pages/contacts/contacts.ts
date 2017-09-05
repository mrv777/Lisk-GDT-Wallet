import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { AccountDataProvider } from '../../providers/account-data/account-data';
import { EditContactModalPage } from '../edit-contact-modal/edit-contact-modal';

/**
 * Generated class for the ContactsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {
  contacts: object[];

  constructor(public navCtrl: NavController, public accountData: AccountDataProvider, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsPage');
    this.loadContacts();
  }

  loadContacts() {
    this.accountData.getContacts().then((currentContacts) => {
      if (currentContacts != null && currentContacts.length != 0) {
        this.contacts = currentContacts;
        this.contacts.sort((b, a) => {
          if (a['name'] < b['name']) return -1;
          else if (a['name'] > b['name']) return 1;
          else return 0;
        });
      } else {
        this.contacts = null;
      }
    });
  }

  removeContact(removedAccount) {
    this.accountData.removeContact(removedAccount).then(() => {
      this.loadContacts();
    });
  }

  editContact(name:string, account:string) {
    let myModal = this.modalCtrl.create(EditContactModalPage, { name: name, account: account });
    myModal.present();
    myModal.onDidDismiss(data => {
      this.loadContacts();
    });
  }

  logout() {
    this.accountData.logout();
    this.navCtrl.setRoot('LoginPage');
  }

}