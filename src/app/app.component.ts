import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HelpComponent } from './components/help/help.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'ephemerakit';

  constructor(
    public dialog: MatDialog
  ) { }

  openHelpDialog() {
    this.dialog.open(HelpComponent);
  }

}
