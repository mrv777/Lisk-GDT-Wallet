import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http'
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the CurrenciesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CurrenciesProvider {

  constructor(public http: Http) {
    console.log('Hello CurrenciesProvider Provider');
  }

  getPrice(currency) : Observable<object> {
	  return this.http.get(`https://min-api.cryptocompare.com/data/price?fsym=LSK&tsyms=${currency}`)
	    .map((res:Response) => res.json())
	    .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

}
