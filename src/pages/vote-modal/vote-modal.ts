import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AccountDataProvider } from '../../providers/account-data/account-data';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

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
  fingerAvailable: boolean = false;
  guest: boolean = false;
  passwordType: string = 'password';

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public accountData: AccountDataProvider, private barcodeScanner: BarcodeScanner, private faio: FingerprintAIO) {
  	if (navParams.get('delegates')) {
      this.delegatesVoted = navParams.get('delegates');
      this.delegatesVotedNames = navParams.get('names');

      if (this.delegatesVotedNames.length == 0) {
      	this.delegatesVotedNames = ['No Votes to Change'];
      }
    }
	
	this.accountData.getAccount().then((account) => {
	  	if (account['account']['secondPublicKey'] != null){
	  		this.accountHasSecondPass = true;
	  	}
	  });

	this.wasAccountLogin = this.accountData.wasAccountLogin();
    
  }

  ionViewDidLoad() {
    this.guest = this.accountData.isGuestLogin();
     this.faio.isAvailable().then((available) => {
	    if (available == 'OK' || available == 'Available') {
	      this.fingerAvailable = true;
	    } else {
	      this.fingerAvailable = false;
	    }
	  });
  }

  togglePassword() {
  	if (this.passwordType == 'password') {
  		this.passwordType = 'text';
  	} else {
  		this.passwordType = 'password';
  	}
  }

  showFingerprint() {
    this.faio.show({
      clientId: 'Lisk-GDT',
      clientSecret: this.accountData.getFingerSecret(), //Only necessary for Android
      disableBackup: false  //Only for Android(optional)
    })
    .then((result: any) => { 
    	this.password = this.accountData.getSavedPassword();
    })
    .catch((error: any) => console.log(error));
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
    if (this.accountData.convertPasswordToAccount(this.password) == this.accountData.getAccountID()) {
    	if (this.password != null && this.password != '' && this.delegatesVotedNames != ['No Votes to Change']) {
  	  	this.disableVote = true;
  	  	let password = this.password;
  	  	this.accountData.voteDelegates(this.delegatesVoted, this.secondPass, password).then((result) => {
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
  			 	}, 12000);
  	  		}
  		  });
  	 } else {
  	 	this.resultTxt = "Passphrase required";
  	 	this.status = -1;
  	 }
   } else {
      this.resultTxt = "Incorrect Passphrase";
      this.status = -1;
    }
  }

  closeModal(success: boolean = false) {
    this.viewCtrl.dismiss(success);
  }

}
