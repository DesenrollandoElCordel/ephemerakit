import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private counter: number = 0;
  private width: number = 0;
  private height: number = 0;
  private svgElement: any = null;
  private blobUrl: string = '';
  private canvas: any = null;
  private ctx: any = null;
  private png: any = null;

  constructor() { }

  async saveAsPng(svgElement: SVGGraphicsElement) {
    this.svgElement = svgElement;
    await this.generateSvgUrl()
    await this.generateCanvas();
    await this.generatePng();
    this.download();
  }

  generateSvgUrl() {
    return new Promise((resolve) => {
      let { width, height } = this.svgElement.getBBox();
      this.width = width;
      this.height = height;
      let clonedSvgElement = this.svgElement.cloneNode(true);
      let svgString = new XMLSerializer().serializeToString(clonedSvgElement);
      let svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      let DOMURL = self.URL || self.webkitURL || self;
      let url = DOMURL.createObjectURL(svg);
      this.blobUrl = url;
      resolve(true);
    });
  }

  generateCanvas() {
    return new Promise((resolve) => {
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.ctx = this.canvas.getContext("2d");
      resolve(true);
    });
  }

  generatePng() {
    return new Promise((resolve) => {
      let img = new Image();
      let canvas = this.canvas;
      let ctx = this.ctx;
      let that = this;
      img.onload = function() {
        ctx.drawImage(img, 0, 0);
        let png = document.createElement('a');
        png.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        png.download = 'MyPliego.png';
        that.png = png;
        resolve(true);
      };
      img.src = this.blobUrl;
    });
  }

  download() {
    this.png.click();
  }

}
