import { Component, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { Pliego } from '../models/pliego';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class BottomSheetComponent implements AfterViewInit {

  key: string;
  pliego: Pliego;

  @ViewChild('input', { read: ElementRef, static: false }) inputElement!: ElementRef;

  constructor(
    private bottomSheet: MatBottomSheet,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.key = data.key;
    this.pliego = data.pliego;
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.inputElement.nativeElement.focus(), 0);
  }

  closeBottomSheet() {
    this.bottomSheet.dismiss();
  }

}
