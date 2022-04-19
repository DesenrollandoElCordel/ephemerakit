import { Injectable } from '@angular/core';
import { Canvg } from 'canvg';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Pliego } from '../models/pliego';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  public exportRunning: boolean = false;
  private appType: string = environment.appType;
  private appPrinterURL: string = environment.appPrinterURL;

  constructor(private http: HttpClient) { }

  saveAsPng(svgElement: SVGGraphicsElement) {
    return new Promise((resolve) => {
      this.exportRunning = true;
      this.exportPNG(svgElement, () => {
        this.exportRunning = false;
        resolve(true);
      });
    });
  }

  exportAsDataURL(svgElement: SVGGraphicsElement, pliego: Pliego) {
    return new Promise((resolve) => {
      this.exportRunning = true;
      this.exportCanvas(svgElement, (canvas: HTMLCanvasElement) => {
        let data: string = JSON.stringify({ pliego: pliego, image: canvas.toDataURL() });
        this.postDataURL(data).subscribe((response) => {
          this.exportRunning = false;
          resolve(response);
        }, (error) => {
          resolve({
            output: [error.message],
            retval: 1
          });
        });
      });
    });
  }

  postDataURL(data: string): Observable<any> {
    return this.http.post(this.appPrinterURL, data, httpOptions);
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
    if (this.appType) {
      (clonedSvgElement as Element).querySelector("#bgImg")!.remove();
    }
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
