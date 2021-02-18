import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from './global.service';

@Injectable()
export class CantonService{
    public url : string;
    public Token : string;
    constructor(public _Http : HttpClient) {
        this.url = Config.Url + 'canton/';
        this.Token = localStorage.getItem('Token');
    }
    Create(Object) : Observable<any> {
        const params = JSON.stringify(Object);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);

        return this._Http.post(this.url + 'create', params, {headers});
    }
    Read() : Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);
        return this._Http.get(this.url + 'read', {headers});
    }
    Update(Object) : Observable<any> {
        const params = JSON.stringify(Object);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);

        return this._Http.put(this.url + 'update/' + Object._id, params, {headers});
    }
}