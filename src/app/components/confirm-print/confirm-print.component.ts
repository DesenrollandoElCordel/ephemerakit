import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-print',
  templateUrl: './confirm-print.component.html',
  styleUrls: ['./confirm-print.component.scss']
})
export class ConfirmPrintComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmPrintComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }

}
