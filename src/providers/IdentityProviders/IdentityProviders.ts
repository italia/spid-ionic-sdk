/**
 * Created by vivad on 07/10/17.
 */

import {Injectable} from "@angular/core";
import {Api} from "../api/api";
import {URL_LIST_PROVIDERS} from "../../models/Costants";

@Injectable()
export class IdentityProviders {

  constructor(public api: Api) { }

  query(params?: any) {
    return this.api.get(URL_LIST_PROVIDERS, params);
  }

}
