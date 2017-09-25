import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ModalController, Platform, Select } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { PinDialog } from '@ionic-native/pin-dialog';

import { AccountDataProvider } from '../../providers/account-data/account-data';
import { HomePage } from '../home/home';
import { NewAccountPage } from '../new-account/new-account';
import { FingerprintWizardPage } from '../fingerprint-wizard/fingerprint-wizard';


/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild('selectAccount') selectAccount: Select;
  private loginForm : FormGroup;
  password: string = '';
  hideCustom: boolean;
  disableLogin: boolean = false;
  node: string;
  nodeSelect: string;
  fingerAvailable: boolean = false;
  cordovaAvailable: boolean = false;
  message: string;
  accountNum: number = 1;
  accountActive: boolean = false;
  passwordActive: boolean = true;
  loginLabel: string = "Password";
  loginType: string = "password";

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountData: AccountDataProvider, private barcodeScanner: BarcodeScanner, private formBuilder: FormBuilder, private faio: FingerprintAIO, public modalCtrl: ModalController, public platform: Platform, private pinDialog: PinDialog) {
    this.loginForm = this.formBuilder.group({
      passwordForm: ['', Validators.required],
      nodeForm: ['', Validators.required],
      nodeSelectForm: [''],
      accountNumForm: ['']
    });
  }

  ionViewDidLoad() { 
  	this.platform.ready().then((readySource) => {
	    this.accountData.init();
	    if (this.platform.is('cordova')) {
        this.cordovaAvailable = true;
	      this.faio.isAvailable().then((available) => {
	        if (available == 'OK' || available == 'Available') {
	          this.fingerAvailable = true;
	        } else {
	          this.fingerAvailable = false;
	        }
	      });
	    } else {
	    	this.fingerAvailable = false;
	    }

	    this.accountData.getNode().then((node) => {
	      if (node == null) {
	        this.node = "mainnet/";
	        this.nodeSelect = "mainnet/";
	        this.hideCustom = true;
	      } else {
		    this.node = node;
		    if (this.node == "mainnet/" || this.node == "testnet/") {
		    	this.hideCustom = true;
		    	this.nodeSelect = node;
		    } else {
		    	this.hideCustom = false;
		    	this.nodeSelect = '';
		    }
	      }
	    });
	 });
  }

  onLogin() {
    this.disableLogin = true;
    this.accountData.setNode(this.node).then(() => {  
    	this.accountData.login(this.password, this.accountNum-1, this.loginLabel);
    	this.navCtrl.setRoot(HomePage);
    });
  }

  toggleLogin(activeButton: string){
  	this.loginLabel = activeButton;
  	if (activeButton == "Account") {
  		this.accountActive = true;
  		this.passwordActive = false;
  		this.loginType = 'text';
  	} else {
  		this.accountActive = false;
  		this.passwordActive = true;
  		this.loginType = 'password';
  	}
  	
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
      this.password = barcodeData['text'];
    }, (err) => {
        // An error occurred
    });
  }

  openModal(modal:string) {
    if (modal == 'fingerprint') {
      let myModal = this.modalCtrl.create(FingerprintWizardPage);
	    myModal.present();
	    myModal.onDidDismiss(data => {
	      this.password = data;
	    });
    } else { 
      let myModal = this.modalCtrl.create(NewAccountPage);
	    myModal.present();
	    myModal.onDidDismiss(data => {
	      this.password = data;
	    });
    }
  }

  openSelectAccount() {
    this.selectAccount.open();
  }

  showPinDialog() {
    this.pinDialog.prompt('Enter your PIN', '', ['OK', 'Cancel'])
    .then(
      (result: any) => {
        if (result.buttonIndex == 1) this.message = 'User clicked OK, value is: '+ result.input1;
        else if(result.buttonIndex == 2) this.message = 'User cancelled';
      }
    );
  }

  showFingerprint() {
    this.faio.show({
      clientId: 'Lisk-GDT',
      clientSecret: 'gDtLisk2o17Wal!et', //Only necessary for Android
      disableBackup: false  //Only for Android(optional)
    })
    .then((result: any) => { 
    	// console.log(result.withFingerprint); 
    	const savedLogin = this.accountData.getSavedPassword(this.accountNum-1);
    	if (savedLogin['type'] != null && savedLogin['type'] != '') {
	    	this.password = savedLogin['password'];
	    	this.loginLabel = savedLogin['type'];
    	} else { //Legacy support
    		this.password = savedLogin['password'];
    		this.loginLabel = 'Password';
    	}
    	if (this.loginLabel == "Account") {
	  		this.accountActive = true;
	  		this.passwordActive = false;
	  		this.loginType = 'text';
	  	} else {
	  		this.accountActive = false;
	  		this.passwordActive = true;
	  		this.loginType = 'password';
	  	}
    })
    .catch((error: any) => console.log(error));
  }

}
