import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  getItem(name: string): string {
    return localStorage.getItem(name) || '';
  }

  setItem(name: string, value: string): void {
    localStorage.setItem(name, value);
  }

}
