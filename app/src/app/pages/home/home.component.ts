import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../../bottom-sheet/bottom-sheet.component';
import { GlobalVariables } from '../../commons/global-variables';

import { Base64Service } from '../../services/base64.service';
import { ExportService } from '../../services/export.service';

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
  editmode: string = "none";
  appType: string = GlobalVariables.appType;
  @ViewChild('pliegoSVG', { static: false }) svg: any;
  @ViewChild('canvas', { static: false }) canvas: any;

  constructor(
    public b64: Base64Service,
    private exportService: ExportService,
    private bottomSheet: MatBottomSheet,
  ) { }

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
        this.editmode = "block";
        break;
      default:
        this.editmode = "none";
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
    this.displayPercents = false;
    this.exportService.exportAsDataURL(this.svg.nativeElement, this.pliego).then(() => {
      this.displayLoader = false;
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

}
