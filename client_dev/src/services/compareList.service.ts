import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from './global.service';

@Injectable()
export class CompareListService{
    public url : string;
    public Token : string;

    constructor(public _Http : HttpClient) {
        this.url = Config.Url + 'compare-list/';
        this.Token = localStorage.getItem('Token');
    }
    Read() : Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                         .set('Authorization', this.Token);

        return this._Http.get(this.url + 'get-list', {headers});
    }

}