import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

declare var require: any;
const lisk = require('lisk-js');

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
  SAVED_PASSWORD = ["","",""];
  OPTIONS;

  constructor(
    public events: Events,
    public storage: Storage,
    private secureStorage: SecureStorage
  ) {
      this.secureStorage.create('lisk_gdt_password')
      .then((storage: SecureStorageObject) => {
        storage.get('password0')
        .then(
          data => { this.SAVED_PASSWORD[0] = data; },
          error => console.log(error)
        );
        storage.get('password1')
        .then(
          data => { this.SAVED_PASSWORD[1] = data; },
          error => console.log(error)
        );
        storage.get('password2')
        .then(
          data => { this.SAVED_PASSWORD[2] = data; },
          error => console.log(error)
        );
      });

  }

  login(password: string, savePassword: boolean, accountNum: number): void {
    this.PASSWORD = password;
    if (savePassword){ 
      this.secureStorage.create(`lisk_gdt_password`)
      .then((storage: SecureStorageObject) => {
        storage.set(`password${accountNum}`, password)
        .then(
          data => { this.SAVED_PASSWORD[accountNum] = password; },
          error => console.log(error)
        );
      });
    }

    this.KEY_PAIR = lisk.crypto.getKeys(password);
    this.PUBLIC_KEY = this.KEY_PAIR['publicKey'];

    const accountID = lisk.crypto.getAddress(this.PUBLIC_KEY);
    this.ACCOUNT_ID = accountID;
    this.storage.set(this.SAVED_ACCOUNTS, accountID);
    this.setAccountID(accountID);

    this.getAccount().then((account) => {
	  	if (account['account'] && account['account']['secondPublicKey'] != null){
	  		this.HAS_SECOND_PASSWORD = true;
	  	}
	  });
    
    this.events.publish('user:login');
  };

  getSavedPassword(accountNum: number): string {
    return this.SAVED_PASSWORD[accountNum];
  }

  logout(): void {
    this.PASSWORD = null;
    this.PUBLIC_KEY = null;
    this.ACCOUNT_ID = null;
    this.KEY_PAIR = null;
    this.storage.remove('accountID');
    this.events.publish('user:logout');
  };

  setAccountID(accountID: string): void {
    this.ACCOUNT_ID = accountID;
  };

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

  searchDelegates(username: string) {
	return new Promise(resolve => {
  		lisk.api(this.OPTIONS).searchDelegateByUsername(username, resolve);
  	});
  };
  
  getPublicKey(): string {
    return this.PUBLIC_KEY;
  };

  hasLoggedIn(): boolean {
    if (this.PASSWORD == null)
        return false;
    else
        return true;
  };

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

  convertPasswordToAccount(password): string {
    const pKey = lisk.crypto.getKeys(password)['publicKey'];

    const accountID = lisk.crypto.getAddress(pKey);
    return accountID;
  }

  voteDelegates(delegates: string[], secondPass: string = null): Promise<any> {
  	let transaction;
  	if (this.HAS_SECOND_PASSWORD) {
  		transaction = lisk.vote.createVote(this.PASSWORD, delegates, secondPass, 20);
  	} else {
  		transaction = lisk.vote.createVote(this.PASSWORD, delegates, null, 20);	
  	}
  	console.log(transaction);
  	return this.broadcastTX(transaction);
  }

  sendLisk(to: string, amount: string, secondPass: string = null): Promise<any> {
  	let transaction;
  	let amountNum = parseInt(amount, 10);
  	if (this.HAS_SECOND_PASSWORD) {
  		transaction = lisk.transaction.createTransaction(to, amountNum, this.PASSWORD, secondPass);
  	} else {
  		transaction = lisk.transaction.createTransaction(to, amountNum, this.PASSWORD, null);
  	}
  	console.log(transaction);
  	return this.broadcastTX(transaction);
  }

  broadcastTX(tx: object): Promise<any>{
  	let request = {
        requestMethod: 'POST',
        requestUrl: lisk.api(this.OPTIONS).getFullUrl() + '/peer/' + 'transactions',
        nethash: lisk.api(this.OPTIONS).nethash,
        requestParams: { transaction: tx }
    };

    return lisk.api(this.OPTIONS).doPopsicleRequest(request).then(function (result) {
        console.log(result);
        return result['body'];
    });

  }

  signTransaction(unsignedTransactionBytes: string): string  {
    return lisk.crypto.sign(unsignedTransactionBytes, this.KEY_PAIR);
  }
}