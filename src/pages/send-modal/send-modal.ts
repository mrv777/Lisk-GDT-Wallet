import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, Select } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import * as Big from 'big.js';

import { AccountDataProvider } from '../../providers/account-data/account-data';

/**
 * Generated class for the SendModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send-modal',
  templateUrl: 'send-modal.html',
})
export class SendModalPage {

  private sendForm : FormGroup;
  recipient: string = '';
  amount: number = 0;
  status: number;
  disableSend: boolean = false;
  disableClose: boolean = false;
  resultTxt: string = '';
  secondPass: string;
  accountHasSecondPass: boolean = false;

  constructor(public navCtrl: NavController, public accountData: AccountDataProvider, public navParams: NavParams, public viewCtrl: ViewController, private barcodeScanner: BarcodeScanner, private formBuilder: FormBuilder) {
  	this.sendForm = this.formBuilder.group({
      recipientForm: ['', Validators.required],
      amountForm: ['', Validators.required],
      secondForm: ['']
    });
    if (navParams.get('address')) {
      this.recipient = navParams.get('address');
    }
    this.accountData.getAccount().then((account) => {
	  	if (account['account'] && account['account']['secondPublicKey'] != null){
	  		this.accountHasSecondPass = true;
	  	}
	  });
  }

  ionViewDidLoad() {
    
  }

  onSend() {
  	this.disableSend = true;
    let amountBig = new Big(this.amount);
    let convertedAmount = new Big(amountBig.times(100000000));
    this.resultTxt = `Attempting to send ${this.recipient} ${amountBig}LSK`;
    this.accountData.sendLisk(this.recipient, convertedAmount, this.secondPass).then((result) => { console.log(result);
  		if (result['success'] == false) {
  			this.resultTxt = result['message'];
  			this.disableSend = false;
  			this.status = -1;
  		} else {
  			this.status = 1;
  			this.resultTxt = "Sending Lisk, please wait";
  			this.disableClose = true;
		    setTimeout( () => {
		      this.closeModal();
		 	}, 2000);
  		}
	  });
    this.status = 0;
  }

  openBarcodeScanner() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.recipient = barcodeData['text'];
    }, (err) => {
        // An error occurred
    });
  }

  openBarcodeScannerPassword() {
  	this.barcodeScanner.scan().then((barcodeData) => {
      this.secondPass = barcodeData['text'];
    }, (err) => {
        // An error occurred
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
