import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { Pliego } from '../models/pliego';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class BottomSheetComponent implements OnInit {

  key: string;
  pliego: Pliego;

  constructor(
    private bottomSheet: MatBottomSheet,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.key = data.key;
    this.pliego = data.pliego;
  }

  ngOnInit(): void {
  }

  closeBottomSheet() {
    this.bottomSheet.dismiss();
  }

}
