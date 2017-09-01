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
  delegateNames: string[];
  delegatesVotedNames: string[];
  accountHasSecondPass: boolean = false;
  secondPass: string;
  resultTxt: string = '';
  status: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public accountData: AccountDataProvider, private barcodeScanner: BarcodeScanner) {
  	if (navParams.get('delegates')) {
      this.delegatesVoted = navParams.get('delegates');
      this.delegateNames = navParams.get('names');
    }
    this.delegatesVotedNames = this.delegatesVoted;
	
	this.accountData.getAccount().then((account) => {
	  	if (account['account']['secondPublicKey'] != null){
	  		this.accountHasSecondPass = true;
	  	}
	  });
    
  }

  ionViewDidLoad() {
    
  }

  openBarcodeScanner() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.secondPass = barcodeData['text'];
    }, (err) => {
        // An error occurred
    });
  }

  sendVote() {
  	this.disableVote = true;
  	this.accountData.voteDelegates(this.delegatesVoted, this.secondPass).then((result) => { console.log(result);
  		if (result['success'] == false) {
  			this.resultTxt = result['message'];
  			this.disableVote = false;
  			this.status = -1;
  		} else {
  			this.status = 1;
  			this.resultTxt = "Submitting vote(s), please wait";
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
