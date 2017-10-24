import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AccountDataProvider } from '../../providers/account-data/account-data';

/**
 * Generated class for the SendOfflineTxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send-offline-tx',
  templateUrl: 'send-offline-tx.html',
})
export class SendOfflineTxPage {

  tx: string;
  node: string;
  nodeSelect: string;
  hideCustom: boolean = true;
  disableSend: boolean = false;
  disableClose: boolean = false;
  resultTxt: string = '';
  status: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, public viewCtrl: ViewController, public accountData: AccountDataProvider) {
  }

  ionViewDidLoad() {
    this.nodeSelect = "mainnet/";
    this.node = this.nodeSelect;
  }

  changeNode() {
    if (this.nodeSelect == "") {
      this.hideCustom = false;
    } else {
      this.hideCustom = true;
    }
    this.node = this.nodeSelect;
  }

  openBarcodeScanner() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.tx = barcodeData['text'];
    }, (err) => {
        // An error occurred
    });
  }

  onSend() {
  	this.disableSend = true;
    this.resultTxt = `Attempting to send tx: ${this.tx} on ${this.node}`;

    let txObject = JSON.parse(this.tx);
    this.accountData.broadcastTX(txObject, true, this.node).then((result) => {
  		if (result['success'] == false) {
  			this.resultTxt = result['message'];
  			this.disableSend = false;
  			this.status = -1;
  		} else {
  			this.status = 1;
  			this.resultTxt = `Transaction successfully broadcasted with id: ${result['transactionId']}`;
  		}
	  });
    this.status = 0;
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
