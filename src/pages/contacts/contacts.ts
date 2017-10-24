import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, PopoverController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';

import { AccountDataProvider } from '../../providers/account-data/account-data';
import { ContactsMenuPage } from '../contacts-menu/contacts-menu';
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
  guest: boolean = false;

  constructor(public navCtrl: NavController, public accountData: AccountDataProvider, public navParams: NavParams, public modalCtrl: ModalController, private toastCtrl: ToastController, private fileChooser: FileChooser, public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsPage');
    this.loadContacts();
  }

  loadContacts() {
    this.guest = this.accountData.isGuestLogin();
    if (!this.guest) {
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
  }

  editContact(name:string, account:string, type:string) {
    let myModal = this.modalCtrl.create(EditContactModalPage, { name: name, account: account, type: type });
    myModal.present();
    myModal.onDidDismiss(data => {
      this.loadContacts();
    });  
  }

  presentPopover(myEvent, account, name) {
    let popover = this.popoverCtrl.create(ContactsMenuPage, { account: account, name: name } );
    popover.present({
      ev: myEvent,

    });
    popover.onDidDismiss(data => {
      this.loadContacts();
    });
  }

  exportContacts(){
  	this.accountData.exportContacts().then((message) => {
      // Toast Message
      let toast = this.toastCtrl.create({
        message: message,
        duration: 10000,
        position: 'bottom'
      });
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();
    });
  }

  importContacts(){
  	this.fileChooser.open()
	  .then((uri) => { 
	  	this.accountData.importContacts(uri).then((message) => { console.log("testing: " + message);
	  		 // Toast Message
		      let toast = this.toastCtrl.create({
		        message: message,
		        duration: 10000,
		        position: 'bottom'
		      });
		      toast.onDidDismiss(() => {
		        console.log('Dismissed toast');
		      });

		      toast.present();
	  	});
	  })
	  .catch(e => console.log(e));
  }

}