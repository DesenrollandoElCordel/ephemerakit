import { Injectable } from '@angular/core';
import { Canvg } from 'canvg';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  public exportPNGRunning: boolean = false;

  constructor() { }

  saveAsPng(svgElement: SVGGraphicsElement) {
    return new Promise((resolve) => {
      this.exportPNGRunning = true;
      this.exportPNG(svgElement, () => {
        this.exportPNGRunning = false;
        resolve(true);
      });
    });
  }

  exportPNG(svgElement: SVGGraphicsElement, callback: any) {
    this.exportCanvas(svgElement, (canvas: HTMLCanvasElement) => {
      canvas.toBlob((blob) => {
        var link = document.createElement("a");
        link.download = "EphemeraKit.png";
        link.href = URL.createObjectURL(blob);
        link.click();
        callback();
      });
    });
  }

  async exportCanvas(svgElement: SVGGraphicsElement, callback: any) {
    let { width, height } = svgElement.getBBox();
    let clonedSvgElement = svgElement.cloneNode(true);
    let svgString = new XMLSerializer().serializeToString(clonedSvgElement);
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
    const v = Canvg.fromString(ctx, svgString);
    await v.render();
    callback(canvas);
  }

}
