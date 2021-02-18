import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { SideChatService } from './side-chat.service';
import { SideChat } from './side-chat.model';
import { UsuarioService } from '../../../../services/usuario.service';
import { MessageService } from '../../../../services/message.service';
import { Message } from '../../../../models/message.model';

@Component({
  selector: 'app-side-chat',
  templateUrl: './side-chat.component.html',
  styleUrls: ['./side-chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SideChatService, UsuarioService, MessageService]
})
export class SideChatComponent implements OnInit {
  public settings: Settings;
  public showHoverableChatItem: boolean = false;
  public showChatWindow: boolean = false;
  public chats: Array<any>;
  public talks: Array<any>;
  public interlocutor: any;
  public searchText: string;
  public newChatText: string = '';

  public Usuarios;
  public BufferUsuarios;

  public myMessages;
  public eventName = 'send-message';
  public NewMessage: Message
  public identity;

  public type: string = 'all';
  public searchTitle: string = 'Buscar Algo...';
  // public searchText: string;

  constructor(
    public appSettings: AppSettings,
    private sideChatService: SideChatService,
    private _UsuarioService: UsuarioService,
    private _MessageService: MessageService,
  ) {
    this.settings = this.appSettings.settings;
    this.identity = JSON.parse(localStorage.getItem('Identity'));
    this.chats = sideChatService.getChats();
    this.talks = this.sideChatService.getTalk();
    this._MessageService.listen('first-event').subscribe(
      data => {
        this.myMessages = data;
        // console.log(data);
      }
    );
    this.loadUsuarios();
    this._MessageService.connection('get-message');
    this.initNewMessages();
  }

  checkUsers(usuario): boolean {
    let check = true;
    // console.group('Checkando usuario');
    if (usuario._id != this.identity._id) {
      // console.log('No es Mi Chat');
      // console.log('Soy: ' + this.identity.Role);
      // if (this.identity.Role == 'Motorizado' || this.identity.Role == 'Encargado de Repartidores') {
      //   // console.log('Soy de la Empresa: ' + this.identity.Empresa._id)
      //   // console.log('El Chat es de un: ', usuario.Role);
      //   if (usuario.Role == 'Motorizado' || usuario.Role == 'Encargado de Repartidores') {
      //     // console.log('Es de la Empresa: ', usuario.Empresa)
      //     if (usuario.Empresa._id == this.identity.Empresa._id) {
      //       check = true;
      //     } else {
      //       check = false;
      //     }
      //   } else if (this.identity.Role == 'Encargado de Bodega') {
      //     if (usuario.Role == 'Administrador' || usuario.Role == 'Secretario' || usuario.Role == 'Encargado de Repartidores' ) {
      //       check = true;
      //     }
      //   } else {
      //     check = false;
      //   }
      // } else if (this.identity.Role != 'Encargado de Bodega') {
      //   if (usuario.Role != 'Admin' || usuario.Role != 'Motorizado') {
      //     check = true;
      //   } else {
      //     check = false;
      //   }
      // }
    } else {
      // console.log('es Mi Chat');
      check = false;
    }
    // console.groupEnd();
    return check;
  }

  checkOrigin( To, From ): boolean {
    let check = true;
    // console.log(To._id +  ' === ' + this.interlocutor._id);
    // console.log(From._id +  ' === ' + this.interlocutor._id);
    // console.log(To._id +  ' === ' + this.identity._id);
    // console.log(From._id +  ' === ' + this.identity._id);
    // console.group('Mensajeria')
    if (To._id === this.interlocutor._id) {
      // console.log('mismo destinatario');
      if (From._id == this.identity._id) {
        check = true;
      } else {
        check = false;
      }
    } else if (From._id === this.interlocutor._id) {
      // console.log('mismo emisario');
      if (To._id == this.identity._id) {
          check = true;
        } else {
          check = false;
        }
      
    } else {
      check = false
    }
    // console.groupEnd();
    // if (To._id != this.interlocutor._id && From._id != this.identity._id) {
    //   check = false;
      
    // }
    // if (From._id != this.interlocutor._id && To._id != this.identity._id) check = false;
    return check;
  }

  initNewMessages() {
    this.NewMessage = {
      _id: '',
      Message: '',
      To: '',
      From: this.identity._id,
      At: '',
    }
  }

  sendMessage() {
    this.NewMessage.To = this.interlocutor;
    this._MessageService.emit(this.eventName, this.NewMessage);
    this.NewMessage.Message = '';
  }

  loadUsuarios() {
    this._UsuarioService.Read().subscribe(
      response => {
        this.Usuarios = response.Usuarios;
        this.BufferUsuarios = response.Usuarios;
        // console.log(this.Usuarios);
      }
    )
  }

  ngOnInit() { }

  public back() {
    this.showChatWindow = false
    this.talks.shift();
    this.talks.length = 2;
  }
  public getChat(interlocutor) {
    this.searchText = '';
    this.showChatWindow = true;
    this.interlocutor = interlocutor;
    this.talks.forEach(item => {
      if (item.side == 'left') {
        item.image = interlocutor.image;
      }
    });
    this.talks.unshift(interlocutor);
  }

  public addChatItem($event) {
    if (($event.which === 1 || $event.which === 13) && this.newChatText.trim() != '') {
      this.talks.push(
        new SideChat(
          'assets/img/users/user.jpg',
          'Emilio Verdines',
          'online',
          this.newChatText,
          new Date(),
          'right')
      )
      this.newChatText = '';
      let chatContainer = document.querySelector('.chat-talk-list');
      setTimeout(() => {
        var nodes = chatContainer.querySelectorAll('.media');
        let newChatTextHeight = nodes[nodes.length - 1];
        chatContainer.scrollTop = chatContainer.scrollHeight + newChatTextHeight.clientHeight;
      });
    }
  }

}