import {Injectable} from "@angular/core";
import {Api} from "../api/api";
import {URL_LIST_AUTHSPID} from "../../models/Costants";
/**
 * Created by vivad on 08/10/17.
 */

@Injectable()
export class AuthSpidProviders {

  constructor(public api: Api) { }

  query(value?:string,params?: any) {
    return this.api.get(URL_LIST_AUTHSPID+value, params);
  }

}
