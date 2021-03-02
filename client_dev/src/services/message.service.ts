import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { Config } from './global.service';

@Injectable()
export class MessageService{
    public url : string;
    public SocketUrl: string;
    public Token : string;
    socket: any;
    port=3700;
    constructor(public _Http : HttpClient) {
        this.url = Config.Url + 'message/';
        this.Token = localStorage.getItem('Token');
        this.port = 3700;
        this.SocketUrl = Config.SocketUrl;
        this.socket = io(this.SocketUrl+this.port);
    }
    
    listen(eventName: string) {
        return new Observable((Subscriber) => {
            this.socket.on(eventName, (data) => {
                Subscriber.next(data);
            })

        })
    }
    emit(eventName: string, data: any) {
        this.socket.emit(eventName, data);
    }

    connection(eventName) {
        this.socket.emit(eventName);
    }

    getAll(): Observable<any> {
        // const headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._Http.get('https://restcountries.eu/rest/v2/all', {});
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
    Delete(Object) : Observable<any> {
        if (Object.Active == true) Object.Active = false; else
        if (Object.Active == false) Object.Active = true;
        const params = JSON.stringify(Object);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);

        return this._Http.put(this.url + 'delete/' +  Object._id, params, {headers});
    }
}