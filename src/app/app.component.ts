import { Component, OnInit } from '@angular/core';
import { MessageService } from '@services/message.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-httpclient-example';

  constructor(private messageService: MessageService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.messageService.messages$.subscribe((m: string) => this.snackBar.open(m, null, {
      duration: 4000
    }));
  }
}
