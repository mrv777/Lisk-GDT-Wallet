import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AccountDataProvider } from '../../providers/account-data/account-data';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the VoteModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vote-modal',
  templateUrl: 'vote-modal.html',
})
export class VoteModalPage {
  disableVote: boolean = false;
  delegatesVoted: string[];
  delegatesVotedNames: string[];
  accountHasSecondPass: boolean = false;
  disableClose: boolean = false;
  secondPass: string;
  resultTxt: string = '';
  status: number = 0;
  wasAccountLogin: boolean;
  password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public accountData: AccountDataProvider, private barcodeScanner: BarcodeScanner) {
  	if (navParams.get('delegates')) {
      this.delegatesVoted = navParams.get('delegates');
      this.delegatesVotedNames = navParams.get('names');
    }
	
	this.accountData.getAccount().then((account) => {
	  	if (account['account']['secondPublicKey'] != null){
	  		this.accountHasSecondPass = true;
	  	}
	  });

	this.wasAccountLogin = this.accountData.wasAccountLogin();
    
  }

  ionViewDidLoad() {
    
  }

  openBarcodeScannerPassword(password: string) {
  	this.barcodeScanner.scan().then((barcodeData) => {
      if (password == "password"){
      	this.password = barcodeData['text'];
      } else {
      	this.secondPass = barcodeData['text'];
      }
    }, (err) => {
        // An error occurred
    });
  }

  sendVote() {
  	this.disableVote = true;
  	let password;
    if (this.wasAccountLogin){
    	password = this.password;
    }
  	this.accountData.voteDelegates(this.delegatesVoted, this.secondPass, password).then((result) => { console.log(result);
  		if (result['success'] == false) {
  			this.resultTxt = result['message'];
  			this.disableVote = false;
  			this.status = -1;
  		} else {
  			this.status = 1;
  			this.resultTxt = "Submitting vote(s), please wait";
  			this.disableClose = true;
		    setTimeout( () => {
		      this.closeModal(true);
		 	}, 20000);
  		}
	  });
  }

  closeModal(success: boolean = false) {
    this.viewCtrl.dismiss(success);
  }

}
