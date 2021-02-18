import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from './global.service';

@Injectable()
export class UsuarioService{
    public url : string;
    public Token : string;
    constructor(public _Http : HttpClient) {
        this.url = Config.Url + 'usuario/';
        this.Token = localStorage.getItem('Token');
    }
    Create(Object) : Observable<any> {
        const params = JSON.stringify(Object);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);

        return this._Http.post(this.url + 'create', params, {headers});
    }
    Login(Object) : Observable<any> {
        const params = JSON.stringify(Object);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        // .set('Authorization', this.Token);

        return this._Http.post(this.url + 'login', params, {headers});
    }
    Read() : Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);
        return this._Http.get(this.url + 'read', {headers});
    }
    ReadMotorizados(empresa): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);
        return this._Http.get(this.url + 'read-motorizados/'+empresa, {headers});
    }
    Update(Object) : Observable<any> {
        const params = JSON.stringify(Object);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);

        return this._Http.put(this.url + 'update/' + Object._id, params, {headers});
    }
    changePasswords(Object) : Observable<any> {
        const params = JSON.stringify(Object);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);

        return this._Http.put(this.url + 'change-password', params, {headers});
    }
    Delete(Object) : Observable<any> {
        if (Object.Active == true) Object.Active = false; else
        if (Object.Active == false) Object.Active = true;
        const params = JSON.stringify(Object);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);

        return this._Http.put(this.url + 'delete/' +  Object._id, params, {headers});
    }
    test(): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._Http.get(Config.Url + 'test/', {headers});
    }
}