import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Base64Service {

  private fontsBase64Url = 'assets/fonts.txt';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
  };

  constructor( private http: HttpClient ) { }

  getFontsBase64(): Observable<string> {
    const options: Object = {
      responseType: 'text',
    };
    return this.http.get<string>(this.fontsBase64Url, options)
      .pipe(
        catchError(this.handleError<string>('getFontsBase64', ''))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log("DataService:", message);
  }

}
