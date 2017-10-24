import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, ViewController } from 'ionic-angular';

import { TxDetailsModalPage } from '../tx-details-modal/tx-details-modal';
import { EditContactModalPage } from '../edit-contact-modal/edit-contact-modal';

import { AccountDataProvider } from '../../providers/account-data/account-data';

@IonicPage()
@Component({
  selector: 'page-transactions-tab',
  templateUrl: 'transactions-tab.html',
})
export class TransactionsTabPage {
  accountID: string;
  account: object;
  transactions: object[];
  transactionsCount: number;
  p: number = 1;
  total: number = 0;
  numToDisplay: number = 8;
  contacts: string[];
  contactNames: string[];
  recentTxId: number;
  guest: boolean = false;

  price: number = 0;
  currency: string = 'USD';
  currencies: string[] = ['BTC','ETH','USD','EUR','CNY'];
  symbol: string = '$';
  currencySymbols: string[] = ['฿','Ξ','$','€','¥'];

  subscriptionTx;

  constructor(public navCtrl: NavController, public accountData: AccountDataProvider, public modalCtrl: ModalController, private viewCtrl: ViewController) {

  }

  ionViewDidLoad() {
  	this.accountID = this.accountData.getAccountID();
	this.loadTxs();
	this.guest = this.accountData.isGuestLogin();
  }

  openModal(modal:string, tx:string = null) {
     let myModal = this.modalCtrl.create(TxDetailsModalPage, { tx: tx });
     myModal.present();
  }


  loadTxs() {
  	this.accountData.getContacts().then((currentContacts) => {
        if (currentContacts != null) {
          this.contacts = [];
          this.contactNames = [];
          for (let i=0;i < currentContacts.length; i++) {
            this.contacts.push(currentContacts[i]['account']);
            if (currentContacts[i]['name'] != '') {
              this.contactNames.push(currentContacts[i]['name']);
            } else {
              this.contactNames.push(currentContacts[i]['account']);
            }
          }
        } else {
          this.contacts = [''];
          this.contactNames = [''];
        }
      });
  	this.accountData.getAccount(this.accountID).then((account) => { 
	  	this.account = account;
	  });
  	this.accountData.getAccountTransactions(this.accountID, this.numToDisplay, (this.numToDisplay * (this.p-1))).then((transactions) => {
	  	this.transactions = transactions['transactions'];
	  	if (transactions['transactions'][0] && transactions['transactions'][0]['id']) {
	  		this.recentTxId = this.transactions[0]['id']; // Record the most recent TX id
	  	}
	  	this.total = transactions['count'];
	  	for (let i=0;i < this.transactions.length; i++) {
	      this.transactions[i]['date'] = new Date((1464109200 + this.transactions[i]['timestamp'])*1000);
	    } 
	  	this.transactionsCount = transactions['count'];
	  	clearInterval(this.subscriptionTx);
	  	this.subscriptionTx = setInterval(() => { this.loadRecentTX(); }, 3000);
	  });
  }

  loadRecentTX() {
  	this.accountData.getAccountTransactions(this.accountID, 1, this.numToDisplay * (this.p-1)).then((transactions) => {
  		if (transactions['transactions'][0] && transactions['transactions'][0]['id'] && transactions['transactions'][0]['id'] != this.recentTxId) { // Only reload everything if there was a recent TX (Balance will go off for forging accounts)
  			this.loadTxs();
  		}
  	});
  }

  addNewContact(account:string) {
    let myModal = this.modalCtrl.create(EditContactModalPage, { name: '', account: account, type: 'new' });
    myModal.present();
    myModal.onDidDismiss(data => {
      this.accountData.getContacts().then((currentContacts) => {
        if (currentContacts != null) {
          this.contacts = [];
          this.contactNames = [];
          for (let i=0;i < currentContacts.length; i++) {
            this.contacts.push(currentContacts[i]['account']);
            if (currentContacts[i]['name'] != '') {
              this.contactNames.push(currentContacts[i]['name']);
            } else {
              this.contactNames.push(currentContacts[i]['account']);
            }
          }
        } else {
          this.contacts = [''];
          this.contactNames = [''];
        }
      });
      this.viewCtrl.dismiss();
    });
  }

  pageChanged(event){
  	this.p = event;
  	clearInterval(this.subscriptionTx);
  	this.loadTxs();
  	console.log(event);
  }

  ionViewDidLeave() { 
  	clearInterval(this.subscriptionTx);
  }

}
