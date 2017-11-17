import { Component } from '@angular/core';
import { NavController, ModalController, PopoverController } from 'ionic-angular';

import { LoginPage } from '../login/login';

import { SendTabPage } from '../send-tab/send-tab';
import { ReceiveTabPage } from '../receive-tab/receive-tab';
import { TransactionsTabPage } from '../transactions-tab/transactions-tab';
import { AccountMenuPage } from '../account-menu/account-menu';

import { AccountDataProvider } from '../../providers/account-data/account-data';
import { CurrenciesProvider } from '../../providers/currencies/currencies';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  guest: boolean = false;
  accountID: string;
  accountName: string;
  account: object;
  transactions: object[];
  transactionsCount: number;
  p: number = 1;
  total: number = 0;
  numToDisplay: number = 10;
  contacts: string[];
  contactNames: string[];
  recentTxId: number;

  txSelected: boolean = true;
  sendSelected: boolean = false;
  receiveSelected: boolean = false;

  price: number = 0;
  currency: string = 'USD';
  currencies: string[] = ['BTC','ETH','USD','EUR','CNY','AUD'];
  symbol: string = '$';
  currencySymbols: string[] = ['฿','Ξ','$','€','¥','A$'];

  subscriptionAccount;

  message;

  private rootPage = TransactionsTabPage;
  private txPage = TransactionsTabPage;
  private sendPage = SendTabPage;
  private receivePage = ReceiveTabPage;

  constructor(public navCtrl: NavController, public accountData: AccountDataProvider, public modalCtrl: ModalController, public currenciesProv: CurrenciesProvider, public popoverCtrl: PopoverController) {

  }

  ionViewDidLoad() {
    if (this.accountData.hasLoggedIn()) {
      this.guest = this.accountData.isGuestLogin();
      console.log("Logged in");
      this.accountID = this.accountData.getAccountID();
      this.accountName = this.accountData.getAccountName();
      if (!this.accountName || this.accountName == null || this.accountName == 'undefined') {
      	this.accountName = 'Lisk GDT Wallet';
      }
      this.loadBalance();
	  this.changeCurrency();
    } else {
      console.log("Not logged in");
      this.navCtrl.setRoot(LoginPage);
    }
  }

  openPage(page) {
    // Reset the nav controller to have just this page
    // we wouldn't want the back button to show in this scenario
    this.rootPage = page;
    if (page == this.txPage) {
    	this.txSelected = true;
    	this.sendSelected = false;
    	this.receiveSelected = false;
    } else if (page  == this.sendPage) {
    	this.txSelected = false;
    	this.sendSelected = true;
    	this.receiveSelected = false;
    } else {
    	this.txSelected = false;
    	this.sendSelected = false;
    	this.receiveSelected = true;
    }
  }

  loadBalance() {
  	this.accountData.getAccount(this.accountID).then((account) => {
	  	this.account = account;
	  	clearInterval(this.subscriptionAccount);
	  	this.subscriptionAccount = setInterval(() => { this.loadRecentTX(); }, 3000);
	  });
  }

  loadRecentTX() {
  	this.accountData.getAccountTransactions(this.accountID, 1, 0).then((transactions) => {
  		if (transactions['transactions'][0] && transactions['transactions'][0]['id'] && transactions['transactions'][0]['id'] != this.recentTxId) { // Only reload everything if there was a recent TX (Balance will go off for forging accounts)
  			this.loadBalance();
  		}
  		if (transactions['transactions'][0] && transactions['transactions'][0]['id']) {
  			this.recentTxId = transactions['transactions'][0]['id'];
  		}
  	});
  }

  presentPopover(myEvent, account, name) {
    let popover = this.popoverCtrl.create(AccountMenuPage);
    popover.present({
      ev: myEvent,

    });
    popover.onDidDismiss(data => {
      if (data == 'remove') {
      	this.logout();
  	  } else {
  	  	this.accountName = this.accountData.getAccountName();
  	  }
    });
  }

  changeCurrency() {
  	this.symbol = this.currencySymbols[this.currencies.indexOf(this.currency)];
  	this.price = 0;
  	this.currenciesProv.getPrice(this.currency)
    .subscribe(
      price => {
      	if (price != null && price[`${this.currency}`] != null) {
      		this.price = price[`${this.currency}`];
      	}
      },
      err => { console.log(err); });
  }

  logout() {
    this.accountData.logout();
    this.navCtrl.setRoot(LoginPage);
  }

  ionViewDidLeave() { 
  	clearInterval(this.subscriptionAccount);
  }

}
