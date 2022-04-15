import { Injectable } from '@angular/core';
import { Canvg } from 'canvg';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { GlobalVariables } from '../commons/global-variables';
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
  private appType: string = GlobalVariables.appType;
  private appPrinterURL: string = GlobalVariables.appPrinterURL;

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
        this.postDataURL(data).subscribe(() => {
          this.exportRunning = false;
          resolve(true);
        });
      });
    });
  }

  postDataURL(data: string): Observable<any> {
    return this.http.post<string>(this.appPrinterURL, data, httpOptions).pipe(
      catchError((err) => {
        console.error(err.message);
        return throwError(err);
      })
    );
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

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        'Backend returned code ${error.status}, body was: ', error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}