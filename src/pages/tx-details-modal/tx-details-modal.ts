import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { AccountDataProvider } from '../../providers/account-data/account-data';

/**
 * Generated class for the TxDetailsModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tx-details-modal',
  templateUrl: 'tx-details-modal.html',
})
export class TxDetailsModalPage {

  txId: string;
  tx: object;

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountData: AccountDataProvider, public viewCtrl: ViewController) {
  	this.txId = navParams.get('tx');
  }

  ionViewDidLoad() {
    this.accountData.getTransaction(this.txId).then((tx) => { console.log(tx);
	  	this.tx = tx;
	  	this.tx['transaction']['date'] = new Date((1464109200 + this.tx['transaction']['timestamp'])*1000);
	  });
    
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
