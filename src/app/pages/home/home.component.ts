import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';

import { Base64Service } from '../../services/base64.service';

export class Pliego {
  line1: string = "VRAY DISCOURS";
  line2: string = "de la miraculeuse délivrance envoyée de Dieu";
  line3: string = "À LA VILLE DE GENÈVE";
  line4: string = "le 12, jour de décembre, 1602";
  printer: string = "Georges";
  images: Array<string> = ['tour', 'homme_epee_chapeau', 'femmes_groupe'];
}

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
  pliego = new Pliego();
  displayImgs: any[] = [];
  drawerWidth: string = '33%';
  loaded: string[] = [];
  @ViewChild('drawer', { static: false }) drawer!: MatDrawer;
  @ViewChild('pliegoSVG', { static: false }) svg: any;
  @ViewChild('canvas', { static: false }) canvas: any;

  constructor(
    private b64: Base64Service,
    public breakpointObserver: BreakpointObserver
  ) { }

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
      this.changeB64Img();
    });

    this.breakpointObserver
      .observe(['(min-width: 450px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.drawerWidth = '33%';
        } else {
          this.drawerWidth = '100%';
        }
      });
  }

  switchMode(mode: string): void {
    this.mode = mode;
    this.drawer.toggle();
    console.log(this.drawerWidth);

  }

  async savePNG() {
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
    img.onload = function() {
      ctx!.drawImage(img, 0, 0);
      let png = document.createElement('a');
      png.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      png.download = 'MyPliegos.png';
      png.click();
    };
    img.src = url;
  }

  changeB64Img() {
    this.pliego.images.forEach((key, index) => {
      let tmp = this.b64Imgs.find(obj => obj.key === key);
      if (tmp !== undefined) {
        let i = new Image();
        i.onload = () => {
          tmp = Object.assign(tmp, this.getFiguresData(i, index))
          this.displayImgs[index] = tmp;
        };
        i.src = 'data:image/png;base64,' + tmp.b64;
      } else {
        this.displayImgs[index] = '';
      }
    });
  }

  getFiguresData(img: HTMLImageElement, n: number) {
    let maxWidth = 220;
    let maxHeight = 300;
    let yBottom = 440;
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

}
