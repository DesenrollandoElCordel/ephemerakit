import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../../bottom-sheet/bottom-sheet.component';
import { environment } from '../../../environments/environment';
import { Base64Service } from '../../services/base64.service';
import { ExportService } from '../../services/export.service';
import { Subject } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ConfirmPrintComponent } from '../../components/confirm-print/confirm-print.component';
import { SettingsFormComponent } from '../../components/settings-form/settings-form.component';

import { Pliego } from '../../models/pliego';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  mode: string = "visualize";
  pliego = new Pliego(
    "VRAY DISCOURS",
    "de la miraculeuse délivrance envoyée de Dieu",
    "À LA VILLE DE GENÈVE",
    "le 12, jour de décembre, 1602",
    "Georges",
    ['tour', 'homme_epee_chapeau', 'femmes_groupe']
  );
  pngImages: any[] = [];
  loaded: string[] = [];
  displayLoader: boolean = false;
  displayPercents: boolean = false;
  displayPrinting: boolean = false;
  editmode: boolean = false;
  appType: string = environment.appType;
  @ViewChild('pliegoSVG', { static: false }) svg: any;
  @ViewChild('canvas', { static: false }) canvas: any;
  timeoutId: any;
  userInactive: Subject<any> = new Subject();

  constructor(
    public b64: Base64Service,
    private exportService: ExportService,
    private bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public confirmPrintDialog: MatDialog,
  ) {
    this.checkTimeOut();
    this.userInactive.subscribe((message) => {
      alert(message);
    });
  }

  ngOnInit(): void {
    this.displayLoader = true;
    this.displayPercents = true;
    this.b64.loadData().then(() => {
      this.updateFigures();
      this.displayLoader = false;
      this.displayPercents = false;
    });
  }

  switchMode(mode: string): void {
    this.mode = mode;
    switch (this.mode) {
      case 'edit':
        this.editmode = true;
        break;
      default:
        this.editmode = false;
        break;
    }
  }

  async savePNG() {
    this.displayLoader = true;
    this.displayPercents = false;
    this.exportService.saveAsPng(this.svg.nativeElement).then(() => {
      this.displayLoader = false;
    });
  }

  async printImage() {
    this.displayLoader = true;
    this.displayPrinting = true;
    this.displayPercents = false;
    this.exportService.exportAsDataURL(this.svg.nativeElement, this.pliego).then((response: any) => {
      if (response.retval !== 0) {
        this.displayLoader = false;
        this.displayPrinting = false;
        this.openCompDialog(
          "Erreur lors de l'impression",
          response.output.join("\n")
        );
      } else {
        setTimeout(() => {
          this.displayLoader = false;
          this.displayPrinting = false;
        }, 15000);
      }
    });
  }

  updateFigures() {
    this.pliego.images.forEach((key, index) => {
      let tmp = this.b64.imgs.find(obj => obj.key === key);
      tmp = JSON.parse(JSON.stringify(tmp));
      // We preload image to be sure it will appear in svg, canvas and png
      let i = new Image();
      i.onload = () => {
        tmp = Object.assign(tmp, this.getFiguresData(i, index))
        this.pngImages[index] = tmp;
      };
      i.src = 'data:image/png;base64,' + tmp.b64;
    });
  }

  getFiguresData(img: HTMLImageElement, n: number) {
    let maxWidth = 220;
    let maxHeight = 300;
    let yBottom = 450;
    let xRef = 0;
    let scale = maxWidth / img.width;
    if (scale * img.height > maxHeight) {
      scale = maxHeight / img.height;
    }
    let xOffset = 0.5 * scale * img.width;
    let yOffset = scale * img.height;
    switch (n) {
      case 0:
        xRef = 163;
        break;
      case 1:
        xRef = 370;
        break;
      case 2:
        xRef = 577;
        break;
    }
    return {
      x: Math.round(xRef - xOffset),
      y: Math.round(yBottom - yOffset),
      width: Math.round(img.width * scale),
      height: Math.round(img.height * scale)
    };
  }

  changeImage(n: number, dir: string) {
    let index = this.b64.imgs.findIndex(o => o.key === this.pliego.images[n]);
    if (dir == 'up') {
      index++;
      if (index == this.b64.imgs.length) {
        index = 0;
      }
    } else {
      index--;
      if (index == -1) {
        index = this.b64.imgs.length - 1;
      }
    }
    this.pliego.images[n] = this.b64.imgs[index].key;
    this.updateFigures();
  }

  randomFigures() {
    let keys: string[] = [];
    this.b64.imgs.forEach((img) => {
      keys.push(img.key);
    });
    keys = keys.sort(() => Math.random() - 0.5);
    this.pliego.images[0] = keys[0];
    this.pliego.images[1] = keys[1];
    this.pliego.images[2] = keys[2];
    this.updateFigures();
  }

  openBottomSheet(key: string): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        key: key,
        pliego: this.pliego
      }
    });
  }

  openCompDialog(title: string, message: string) {
    this.dialog.open(DialogComponent, {
      data: { title: title, message: message }
    });
  }

  activeSettingsForm(): boolean {
    return !this.editmode && this.appType == 'print' &&
      this.pliego.images[0] == this.pliego.images[1] && this.pliego.images[1] == this.pliego.images[2];
  }

  settingsForm() {
    if (this.activeSettingsForm()) {
      this.dialog.open(SettingsFormComponent);
    }
  }

  confirmPrintImage() {
    const confirmPrintDialogRef = this.confirmPrintDialog.open(ConfirmPrintComponent, {
      data: {}
    });
    confirmPrintDialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.printImage();
      }
    });
  }

  reinitialize() {
    this.pliego.line1 = "VRAY DISCOURS";
    this.pliego.line2 = "de la miraculeuse délivrance envoyée de Dieu";
    this.pliego.line3 = "À LA VILLE DE GENÈVE";
    this.pliego.line4 = "le 12, jour de décembre, 1602";
    this.pliego.printer = "Georges";
    this.pliego.images = ['tour', 'homme_epee_chapeau', 'femmes_groupe'];
    this.updateFigures();
  }

  checkTimeOut() {
    this.timeoutId = setTimeout(
      () => this.reinitialize(), 120000
    );
  }

  @HostListener('window:keydown')
  @HostListener('window:mousedown')
  checkUserActivity() {
    clearTimeout(this.timeoutId);
    this.checkTimeOut();
  }
}
