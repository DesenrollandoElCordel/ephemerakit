import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { saveAs } from 'file-saver';
import { Base64Service } from '../../services/base64.service';

export class Pliego {

  constructor(
    public title: string
  ) {  }

}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  b64Fonts: string = "";
  pliego = new Pliego("");
  @ViewChild('pliegoSVG', {static: false}) svg: any;
  @ViewChild('canvas', {static: false}) canvas: any;

  constructor(
     private b64: Base64Service
  ) { }

  ngOnInit(): void {
    this.b64.getFontsBase64().subscribe(
      fonts => this.b64Fonts = fonts
    );
  }

  async saveSVG(){
    let svgElement = this.svg.nativeElement;
    let {width, height} = svgElement.getBBox();
    let clonedSvgElement = svgElement.cloneNode(true);
    let outerHTML = clonedSvgElement.outerHTML;
    let blob = new Blob([outerHTML],{type:'image/svg+xml;charset=utf-8'});
    let URL = window.URL || window.webkitURL || window;
    let blobURL = URL.createObjectURL(blob);
    let image = new Image();
    image.onload = () => {
       let canvas = document.createElement('canvas');
       canvas.width = width;
       canvas.height = height;
       let context = canvas.getContext('2d')!;
       context.drawImage(image, 0, 0, width, height );

       canvas.toBlob(function(blob) {
         saveAs(blob!, "pliego.png");
       });


       // let png = canvas.toDataURL();
       // var tmpLink = document.createElement( 'a' );
       // tmpLink.download = 'pliego.png';
       // tmpLink.href = png;
       // document.body.appendChild( tmpLink );
       // tmpLink.click();
       // document.body.removeChild( tmpLink );
    };
    image.src = blobURL;
  }

}
