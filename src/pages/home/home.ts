import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { LoginPage } from '../login/login';

import { SendModalPage } from '../send-modal/send-modal';
import { ReceiveModalPage } from '../receive-modal/receive-modal';

import { AccountDataProvider } from '../../providers/account-data/account-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  accountID: string;
  account: object;
  transactions: object[];
  transactionsCount: number;
  p: number = 1;
  total: number = 0;
  numToDisplay: number = 10;

  subscriptionTx;

  constructor(public navCtrl: NavController, public accountData: AccountDataProvider, public modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
    if (this.accountData.hasLoggedIn()) {
      console.log("Logged in");
      this.accountID = this.accountData.getAccountID();
	  this.loadTxs();
      this.subscriptionTx = setInterval(() => { this.loadTxs(); }, 3000);
    } else {
      console.log("Not logged in");
      this.navCtrl.setRoot(LoginPage);
    }
  }

  openModal(modal:string, fullHash:string = null) {
    if (modal == 'send') {
      let myModal = this.modalCtrl.create(SendModalPage);
      myModal.present();
    } else {
      let myModal = this.modalCtrl.create(ReceiveModalPage);
      myModal.present();
    }
  }

  loadTxs() {
  	this.accountData.getAccount(this.accountID).then((account) => { console.log(account);
	  	this.account = account;
	  });
  	this.accountData.getAccountTransactions(this.accountID, this.numToDisplay, (this.numToDisplay * (this.p-1))).then((transactions) => {
	  	console.log(transactions);
	  	this.transactions = transactions['transactions'];
	  	this.total = transactions['count'];
	  	for (let i=0;i < this.transactions.length; i++) {
	      this.transactions[i]['date'] = new Date((1464109200 + this.transactions[i]['timestamp'])*1000);
	    } 
	  	this.transactionsCount = transactions['count'];
	  });
  }

  pageChanged(event){
  	this.p = event;
  	clearInterval(this.subscriptionTx);
  	this.subscriptionTx = setInterval(() => { this.loadTxs(); }, 3000); 
  	console.log(event);
  }

  logout() {
    this.accountData.logout();
    this.navCtrl.setRoot(LoginPage);
  }

  ionViewDidLeave() { 
  	clearInterval(this.subscriptionTx);
  }

}
