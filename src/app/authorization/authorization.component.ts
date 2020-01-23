import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../shared/web-socket.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {
  private stateTitle = "Authorize/authenticate!!!";
  private bc = new BroadcastChannel('tabsCommChannel');

  constructor(private activatedRoute: ActivatedRoute, private wsService: WebSocketService) {
    this.bc.addEventListener('message', (event) => {
      
    });
   }

  ngOnInit() {
    this.authorize();
  }

  authorize() {
    this.wsService.authorize()
      .subscribe((data: string) => {
        console.log(data);
      });
  }

}
