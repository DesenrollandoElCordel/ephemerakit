import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HelpComponent } from './components/help/help.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'ephemerakit';
  appType: string = environment.appType;
  clickCount: number = 0;

  constructor(
    public dialog: MatDialog
  ) { }

  reload() {
    if (this.appType == 'print') {
      window.location.reload();
    }
  }

  openHelpDialog() {
    this.dialog.open(HelpComponent);
  }

}
