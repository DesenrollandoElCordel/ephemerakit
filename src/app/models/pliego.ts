export class Pliego {

  line1: string;
  line2: string;
  line3: string;
  line4: string;
  printer: string;
  images: Array<string>;

  constructor(line1: string, line2: string, line3: string, line4: string, printer: string, images: Array<string>) {
    this.line1 = line1;
    this.line2 = line2;
    this.line3 = line3;
    this.line4 = line4;
    this.printer = printer;
    this.images = images;
  }

}
