import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../../bottom-sheet/bottom-sheet.component';

import { Base64Service } from '../../services/base64.service';

import { Pliego } from '../../models/pliego';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  mode: string = "visualize";
  b64Fonts: string = "";
  b64Bg: string = "";
  b64Frise: string = "";
  b64Imgs: any[] = [];
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
  displayLoader: boolean;
  editmode: string = "none";
  @ViewChild('pliegoSVG', { static: false }) svg: any;
  @ViewChild('canvas', { static: false }) canvas: any;

  constructor(
    private b64: Base64Service,
    private bottomSheet: MatBottomSheet
  ) {
    this.displayLoader = false;
  }

  ngOnInit(): void {
    this.b64.getFontsBase64().subscribe((fonts) => {
      this.b64Fonts = fonts;
      this.loaded.push('fonts');
    });
    this.b64.getBgBase64().subscribe((b64Bg) => {
      this.b64Bg = b64Bg;
      this.loaded.push('bg');
    });
    this.b64.getFriseBase64().subscribe((b64Frise) => {
      this.b64Frise = b64Frise;
      this.loaded.push('frise');
    });
    this.b64.getImgsBase64().subscribe(b64Imgs => {
      this.b64.imgs.forEach((img, index) => {
        img.b64 = b64Imgs[index];
        this.b64Imgs.push(img);
        this.loaded.push('img');
      });
      this.updateFigures();
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
    let svgElement = this.svg.nativeElement;
    let { width, height } = svgElement.getBBox();
    let clonedSvgElement = svgElement.cloneNode(true);
    let svgString = new XMLSerializer().serializeToString(clonedSvgElement);
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");
    let DOMURL = self.URL || self.webkitURL || self;
    let img = new Image();
    let svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    let url = DOMURL.createObjectURL(svg);
    let that = this;
    img.onload = function() {
      ctx!.drawImage(img, 0, 0);
      let png = document.createElement('a');
      png.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      png.download = 'MyPliego.png';
      png.click();
      that.displayLoader = false;
    };
    img.src = url;
  }

  updateFigures() {
    this.pliego.images.forEach((key, index) => {
      let tmp = this.b64Imgs.find(obj => obj.key === key);
      tmp = JSON.parse(JSON.stringify(tmp));
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
    let index = this.b64Imgs.findIndex(o => o.key === this.pliego.images[n]);
    if (dir == 'up') {
      index++;
      if (index == this.b64Imgs.length) {
        index = 0;
      }
    } else {
      index--;
      if (index == -1) {
        index = this.b64Imgs.length - 1;
      }
    }
    this.pliego.images[n] = this.b64Imgs[index].key;
    this.updateFigures();
  }

  randomFigures() {
    let keys: string[] = [];
    this.b64Imgs.forEach((img) => {
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
