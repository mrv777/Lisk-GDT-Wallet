import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ModalController, Platform, Select, MenuController, FabContainer } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { TranslateService } from '@ngx-translate/core';

import { AccountDataProvider } from '../../providers/account-data/account-data';
import { HomePage } from '../home/home';
import { NewAccountPage } from '../new-account/new-account';
import { FingerprintWizardPage } from '../fingerprint-wizard/fingerprint-wizard';
import { GuestLoginPage } from '../guest-login/guest-login';
import { SendOfflineTxPage } from '../send-offline-tx/send-offline-tx';


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
  account: string;
  accounts: object[];
  accountsLoaded: boolean = false;
  loopIndex: number = 0;
  error: string;
  language: string = "en";

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountData: AccountDataProvider, private barcodeScanner: BarcodeScanner, private formBuilder: FormBuilder, public modalCtrl: ModalController, public platform: Platform,private menu: MenuController, public translate: TranslateService) {
    this.loginForm = this.formBuilder.group({
      passwordForm: ['', Validators.required],
      nodeForm: ['', Validators.required],
      nodeSelectForm: [''],
      accountNumForm: ['']
    });
  }

  ionViewDidLoad() { 
  	this.platform.ready().then((readySource) => {
      this.menu.swipeEnable(false);
      this.accountData.getLang().then((lang) => {
        if (lang && lang != '') {
          this.translate.use(lang);
          this.language = lang;
        } else {
          this.translate.use('en');
          this.language = 'en';
        }
      });
       //Desktop Testing
      // this.accounts = [{account: '11380384760969655418L' , name: 'MrV', password: ''},{account: '1138038476069655418L' , name: 'MrV3', password: ''},{account: '11380384760969655418L' , name: 'MrV2', password: ''}];
       // console.log(this.accounts);
      // this.setBalances();
	    this.accountData.init().then(() => {

        this.accounts = this.accountData.getSavedAccounts();
        //this.accounts = [{account: '11380384760969655418L' , name: 'MrV', password: ''},{account: '1138038476069655418L' , name: 'MrV3', password: ''},{account: '11380384760969655418L' , name: 'MrV2', password: ''}];
        this.setBalances();

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
	 });
  }

  setBalances() {
    this.error = null;
    this.accountData.getAccount(this.accounts[this.loopIndex]['account']).then((account) => {
      if (account['error']) {
        if (account['error']['code'] == "EUNAVAILABLE") {
          this.error = "Unable to connect to server"
        } else {
          this.error = account['message'];
          this.accounts[this.loopIndex]['balance'] = 0;
          if (this.loopIndex == this.accounts.length-1) {
            this.accountsLoaded = true;
          } else {
            this.loopIndex = this.loopIndex + 1;
            this.setBalances();
          }
        }
      } else {
        if (account && account['data'] && account['data'][0] && account['data'][0]['balance']) {
          this.accounts[this.loopIndex]['balance'] = account['data'][0]['balance'];
        } else {
          this.accounts[this.loopIndex]['balance'] = 0;
        }
        if (this.loopIndex == this.accounts.length-1) {
          this.accountsLoaded = true;
        } else {
          this.loopIndex = this.loopIndex + 1;
          this.setBalances();
        }
      }
    })
    .catch((error) => console.log("Error: " + error));

  }

  onLogin(account: string, type: string = "Account") {
    this.disableLogin = true;
    //this.accountData.setNode(this.node).then(() => {  
    	this.accountData.login(account, type);
    	this.navCtrl.setRoot(HomePage);
    //});
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

  openBarcodeScanner() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.password = barcodeData['text'];
    }, (err) => {
        // An error occurred
    });
  }

  setLanguage(lang, fab: FabContainer) {
    this.translate.use(lang);
    this.accountData.setLang(lang);
    this.language = lang;
    fab.close();
  }

  openModal(modal:string) {
    if (modal == 'fingerprint') {
      let myModal = this.modalCtrl.create(FingerprintWizardPage);
	    myModal.present();
	    myModal.onDidDismiss(data => {
	      this.setBalances();
	    });
    } else if (modal == 'guest') {    
      let myModal = this.modalCtrl.create(GuestLoginPage);
      myModal.present();
      myModal.onDidDismiss(data => {
        this.accountData.setGuestLogin();
        this.onLogin(data);
      });
    } else if (modal == 'offlineTx') {
       let myModal = this.modalCtrl.create(SendOfflineTxPage);
      myModal.present();
    } else { 
      let myModal = this.modalCtrl.create(NewAccountPage);
	    myModal.present();
	    myModal.onDidDismiss(data => {
        this.onLogin(data);
	    });
    }
  }

  openSelectAccount() {
    this.selectAccount.open();
  }

}
