import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { File } from '@ionic-native/file';

declare var require: any;
const lisk = require('lisk-js');

declare var cordova: any;

//import { liskjs } from 'lisk-js';

@Injectable()
export class AccountDataProvider {
  SAVED_ACCOUNTS;
  ACCOUNT_ID;
  ACCOUNT;
  PASSWORD;
  HAS_SECOND_PASSWORD = false;
  KEY_PAIR;
  PUBLIC_KEY;
  NODE_URL;
  PIN;
  GUEST_LOGIN: boolean = false;
  OPTIONS: object = { testnet: false };
  LOGIN_STORAGE: SecureStorageObject;
  FINGER_SECRET: string = "something";

  constructor(
    public events: Events,
    public storage: Storage,
    private secureStorage: SecureStorage,
    private file: File
  ) {

  }

  init(): Promise<void> {
    this.secureStorage.create('lisk_gdt_pin')
      .then((storage: SecureStorageObject) => {
        storage.get(`pin`) // Get pin if it's saved
        .then(
          data => { this.PIN = data; },
          error => console.log('Pin Error: ' + error)
        );
      });

      this.SAVED_ACCOUNTS = []; //Initialize saved accounts to empty array before fetching them
    return this.secureStorage.create('lisk_gdt_accounts')
      .then((storageGDT: SecureStorageObject) => { 
      	this.LOGIN_STORAGE = storageGDT;
        return storageGDT.keys()
          .then(
            data => { 
              let ssData = data;
              var promises = [];
              for (let i=0;i<ssData.length; i++) {
                  promises.push(storageGDT.get(ssData[i]));
              }
              return Promise.all(promises)
                .then((accountData) => {
                    for (let i=0;i<ssData.length; i++) {
                        let accountDataArray = accountData[i].split("||");
                        this.SAVED_ACCOUNTS[i] = { account: ssData[i], name: accountDataArray[0], password: accountDataArray[1] };    
                    }
                })
                .catch((e) => {
                    // handle errors here
                });
            },
            error => console.log('Accounts Error ' + error)
          );
      });
  }

  login(password: string, loginType: string): void {
    if (loginType == "Account") {
    	this.ACCOUNT_ID = password;
    	this.getAccount(this.ACCOUNT_ID).then((account) => { 
		  	this.setPublicKey(account['account']['publicKey']);
		  });
	    this.setAccountID(password);
    } else {
	    this.PASSWORD = password;
	    this.KEY_PAIR = lisk.crypto.getKeys(password);
	    this.PUBLIC_KEY = this.KEY_PAIR['publicKey'];

	    const accountID = lisk.crypto.getAddress(this.PUBLIC_KEY);
	    this.ACCOUNT_ID = accountID;
	    this.setAccountID(accountID);
	}

    this.getAccount().then((account) => {
	  	if (account['account'] && account['account']['secondPublicKey'] != null){
	  		this.HAS_SECOND_PASSWORD = true;
	  	}
	  });
    
    this.events.publish('user:login');
  };

  setGuestLogin() {
    this.GUEST_LOGIN = true;
  }

  resetGuestLogin() {
    this.GUEST_LOGIN = false;
  }

  isGuestLogin(): boolean {
    return this.GUEST_LOGIN;
  }


  saveSavedPassword(password: string, account: string, accountName: string, save: boolean) {   
    if (!save) {
      password = "";
    }

    this.LOGIN_STORAGE.set(account, `${accountName}||${password}`)
      .then(
        data => { 
          this.SAVED_ACCOUNTS.push({ account: account, name: accountName, password: password });
        },
        error => console.log(error)
      );
  }

  removeSavedPssword(): Promise<void> {
    const account = this.ACCOUNT_ID;
    const name = this.getAccountName();
    const index = this.SAVED_ACCOUNTS.findIndex(x => x['account']==account);

    return this.LOGIN_STORAGE.set(account, `${name}||`)
      .then(
        data => { 
          if (index !== -1) {
            this.SAVED_ACCOUNTS[index]['password']='';
          }
        },
        error => console.log(error)
      );
  }

  removeCurrentAccount(): Promise<void> {
    // let index = this.SAVED_ACCOUNTS.findIndex(x => x.account==this.ACCOUNT_ID);
    // this.SAVED_ACCOUNTS.splice(index, 1);
    return this.LOGIN_STORAGE.remove(this.ACCOUNT_ID)
      .then(
        data => { 
          console.log(data);
        },
        error => console.log(error)
      );
  }

  getSavedPassword(): string {
    return this.SAVED_ACCOUNTS.filter(x => x.account === this.ACCOUNT_ID).map(x => x.password)[0]; 
  }

  hasSavedPassword(): boolean {
    const pass = this.SAVED_ACCOUNTS.filter(x => x.account === this.ACCOUNT_ID).map(x => x.password)[0]; 
    if (pass == null || pass == '') {
      return false;
    } else {
      return true;
    }
  }

  getSavedAccounts(): object[] {
    return this.SAVED_ACCOUNTS;
  }

  checkPin(pin: string): boolean {
    if (this.PIN === pin) {
      return true;
    } else {
      return false;
    }
  }

  setPin(pin: string) {
    this.LOGIN_STORAGE.set('pin', pin)
    .then(
      data => { this.PIN = pin; },
      error => console.log(error)
    );
  }

  logout(): void {
    this.PASSWORD = null;
    this.PUBLIC_KEY = null;
    this.ACCOUNT_ID = null;
    this.KEY_PAIR = null;
    this.resetGuestLogin();
    this.storage.remove('accountID');
    this.events.publish('user:logout');
  };

  setPublicKey(pkey: string): void {
    this.PUBLIC_KEY = pkey;
  };

  getPublicKey(): string {
    return this.PUBLIC_KEY;
  };

  setAccountID(accountID: string): void {
    this.ACCOUNT_ID = accountID;
  };

  getAccountName(): string {
    return this.SAVED_ACCOUNTS.filter(x => x.account == this.ACCOUNT_ID).map(x => x.name)[0]; 
  }

  editAccountName(name: string): Promise<void> {
    const account = this.ACCOUNT_ID;
    const password = this.getSavedPassword();
    const index = this.SAVED_ACCOUNTS.findIndex(x => x['account']==account);

    return this.LOGIN_STORAGE.set(account, `${name}||${password}`)
      .then(
        data => { 
          if (index !== -1) {
            this.SAVED_ACCOUNTS[index]['name']=name;
          }
        },
        error => console.log(error)
      );
  }

  getAccountID(): string {
    return this.ACCOUNT_ID;
  };

  getAccount(accountID: string = this.ACCOUNT_ID): Promise<object[]> {
  	return new Promise(resolve => {
       lisk.api(this.OPTIONS).getAccount(accountID, resolve);
    });
  };

  getAccountTransactions(address: string, limit: number, offset: number): Promise<object[]> {
	  return new Promise(resolve => {
	    lisk.api(this.OPTIONS).listTransactions(address, limit, offset, resolve);
	  });
  };

  getVotes(address: string) {
	return new Promise(resolve => {
  		lisk.api(this.OPTIONS).listVotes(address, resolve);
  	});
  };

  getActiveDelegates(amount: number) {
	return new Promise(resolve => {
  		lisk.api(this.OPTIONS).listActiveDelegates(amount, resolve);
  	});
  };

  getStandbyDelegates(amount: number) {
	return new Promise(resolve => {
  		lisk.api(this.OPTIONS).listStandbyDelegates(amount, resolve);
  	});
  };

  sendRequest(request: string, parameters: object) {
	return new Promise(resolve => {
  		lisk.api(this.OPTIONS).sendRequest(request, parameters, resolve);
  	});
  };

  searchDelegates(username: string) {
	return new Promise(resolve => {
  		lisk.api(this.OPTIONS).searchDelegateByUsername(username, resolve);
  	});
  };

  getTransaction(tx: string) {
  	return new Promise(resolve => { console.log(tx);
  		lisk.api(this.OPTIONS).getTransaction(tx, resolve);
  	});
  }

  hasLoggedIn(): boolean {
    if (this.ACCOUNT_ID == null)
        return false;
    else
        return true;
  };

  wasAccountLogin(): boolean {
  	if (this.ACCOUNT_ID != null && this.PASSWORD != null)
        return false;
    else
        return true;
  }

  addContact(name: string, account: string): Promise<void> {
    return this.getContacts().then((currentContacts) => {
      if (currentContacts != null) {
        currentContacts.push({ name: name, account: account});
      } else {
        currentContacts = [{ name: name, account: account}];
      }
      this.storage.set(`${this.ACCOUNT_ID}contacts`, currentContacts);
    });
  }

  editContact(name: string, account: string): Promise<void> {
    return this.getContacts().then((currentContacts) => {
      let index = currentContacts.findIndex(x => x['account']==account);
      if (index !== -1) {
          currentContacts[index]['name']=name;
      }
      this.storage.set(`${this.ACCOUNT_ID}contacts`, currentContacts);
    });
  }

  removeContact(account: string): Promise<void> {
    return this.getContacts().then((currentContacts) => {
      // let index = currentContacts.indexOf(account);
      let index = currentContacts.findIndex(x => x['account']==account);
      if (index !== -1) {
          currentContacts.splice(index,1);
      }
      this.storage.set(`${this.ACCOUNT_ID}contacts`, currentContacts);
    });
  }

  getContacts(): Promise<object[]> {
    return this.storage.get(`${this.ACCOUNT_ID}contacts`).then((value) => {
        return value;
    });
  }

  setLang(lang: string): void {
    this.storage.set(`Language`, lang);
  }

  getLang(): Promise<string> {
    return this.storage.get(`Language`).then((value) => {
        return value;
    });
  }

  exportContacts(): Promise<string> {
  	return this.storage.get(`${this.ACCOUNT_ID}contacts`).then((value) => {
  		return this.file.writeFile(cordova.file.externalDataDirectory, `${this.ACCOUNT_ID}contacts.txt`, JSON.stringify(value), {replace: true})
	      .then(function (success) { console.log("success: " + JSON.stringify(success));
	        // success
	        return `Saved to ${success['nativeURL']}`;
	      }, function (error) { console.log("error: " + JSON.stringify(error));
	        // error
	        return "Couldn't save contacts";
	      });
	});
  }

  importContacts(uri: string): Promise<string> { console.log(uri);
  	let n = uri.lastIndexOf('/');
	let path = uri.substring(0, n);
	let file = uri.substring(n + 1);
	return this.file.readAsText(path, file).then((text) => {
		return text;
	});
  }

  setNode(node: string): Promise<void> {
    if (node == 'mainnet/') {
    	this.OPTIONS = { testnet: false };
    } else if (node == 'testnet/') {
    	// this.OPTIONS = { testnet: true };
    	this.OPTIONS = { ssl: true, node: 'testnet.lisk.io', port: '443', testnet: true, randomPeer: false };
    } else {
    	let url;
    	let port;
    	if (node.indexOf(':') > 0) {
    		url = node.substr(0, node.indexOf(':')); 
    		port = node.substr(node.indexOf(':')+1, node.length);
    	} else {
    		url = node;
    		port = 443;
    	}
    	this.OPTIONS = { ssl: true, node: url, port: port, randomPeer: false };
    }
    
    return this.storage.set(`node`, node);
  };

  getNode(): Promise<string> {
    return this.storage.get(`node`).then((value) => {
        return value;
    });
  }

  getFingerSecret(): string {
    return this.FINGER_SECRET;
  }

  convertPasswordToAccount(password): string {
    const pKey = lisk.crypto.getKeys(password)['publicKey'];

    const accountID = lisk.crypto.getAddress(pKey);
    return accountID;
  }

  voteDelegates(delegates: string[], secondPass: string = null, password: string = this.PASSWORD): Promise<any> {
  	let transaction;
  	if (password == null){
  		password = this.PASSWORD;
  	}
  	if (this.HAS_SECOND_PASSWORD) {
  		transaction = lisk.vote.createVote(password, delegates, secondPass, 20);
  	} else {
  		transaction = lisk.vote.createVote(password, delegates, null, 20);	
  	}
  	console.log(transaction);
  	return this.broadcastTX(transaction);
  }

  sendLisk(to: string, amount: string, secondPass: string = null, password: string = this.PASSWORD): Promise<any> {
  	let transaction;
  	let amountNum = parseInt(amount, 10);
  	if (password == null){
  		password = this.PASSWORD;
  	}
  	if (this.HAS_SECOND_PASSWORD) {
  		transaction = lisk.transaction.createTransaction(to, amountNum, password, secondPass, 20);
  	} else {
  		transaction = lisk.transaction.createTransaction(to, amountNum, password, null, 20);
  	}
  	console.log(transaction);
  	return this.broadcastTX(transaction);
  }

  broadcastTX(tx: object, setBroadcastNode: boolean = false, broadcastNode: string = ''): Promise<any>{
  	if (setBroadcastNode) {
      this.setNode(broadcastNode);
    }

    let request = {
        requestMethod: 'POST',
        requestUrl: lisk.api(this.OPTIONS).getFullUrl() + '/peer/' + 'transactions',
        nethash: lisk.api(this.OPTIONS).nethash,
        requestParams: { transaction: tx }
    };

    return lisk.api(this.OPTIONS).doPopsicleRequest(request).then(function (result) {
        return result['body'];
    });

  }

  getDelegate(pKey: string = this.PUBLIC_KEY): Promise<any>{
  	let request = {
        requestMethod: 'GET',
        requestUrl: lisk.api(this.OPTIONS).getFullUrl() + '/api/' + `delegates/get?publicKey=${pKey}`,
    };

    return lisk.api(this.OPTIONS).doPopsicleRequest(request).then(function (result) {
        return result['body'];
    });
  }

  signTransaction(unsignedTransactionBytes: string): string  {
    return lisk.crypto.sign(unsignedTransactionBytes, this.KEY_PAIR);
  }
}