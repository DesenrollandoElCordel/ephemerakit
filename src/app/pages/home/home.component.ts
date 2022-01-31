import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';

import { saveAs } from 'file-saver';
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
  displayImgs: string[] = [];
  drawerWidth: string = '33%';
  @ViewChild('drawer', { static: false }) drawer!: MatDrawer;
  @ViewChild('pliegoSVG', { static: false }) svg: any;
  @ViewChild('canvas', { static: false }) canvas: any;

  constructor(
    private b64: Base64Service,
    public breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.b64.getFontsBase64().subscribe(
      fonts => this.b64Fonts = fonts
    );
    this.b64.getBgBase64().subscribe(
      b64Bg => this.b64Bg = b64Bg
    );
    this.b64.getFriseBase64().subscribe(
      b64Frise => this.b64Frise = b64Frise
    );
    this.b64.getImgsBase64().subscribe(b64Imgs => {
      this.b64.imgs.forEach((img, index) => {
        img.b64 = b64Imgs[index];
        this.b64Imgs.push(img);
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

  async saveSVG() {
    let svgElement = this.svg.nativeElement;
    let { width, height } = svgElement.getBBox();
    let clonedSvgElement = svgElement.cloneNode(true);
    let outerHTML = clonedSvgElement.outerHTML;
    let blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    let URL = window.URL || window.webkitURL || window;
    let blobURL = URL.createObjectURL(blob);
    let image = new Image();
    image.onload = () => {
      let canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      let context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0, width, height);
      canvas.toBlob(function(blob) {
        saveAs(blob!, "pliego.png");
      });
    };
    image.src = blobURL;
  }

  changeB64Img() {
    this.pliego.images.forEach((key, index) => {
      let tmp = this.b64Imgs.find(obj => obj.key === key);
      if (tmp !== undefined) {
        this.displayImgs[index] = tmp.b64;
      } else {
        this.displayImgs[index] = '';
      }
    });
  }

}
