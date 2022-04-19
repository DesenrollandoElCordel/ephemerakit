import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnInit {

  settingsForm = this.formBuilder.group({
    printerURL: '',
  });

  constructor(
    private settings: SettingsService,
    public dialogRef: MatDialogRef<SettingsFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.settingsForm.controls['printerURL'].setValue(this.settings.getItem('printerURL'));
  }

  onSubmit(): void {
    this.settings.setItem('printerURL', this.settingsForm.controls['printerURL'].value);
  }

  closeSettingsForm() { this.dialogRef.close(); }

}
