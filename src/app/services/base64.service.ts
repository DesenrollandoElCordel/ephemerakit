import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Base64Service {

  private fontsBase64Url = 'assets/fonts.txt';
  private bgBase64Url = 'assets/bg.txt';
  private imgBase64Url = 'assets/img/';
  public imgs: Array<string> = [
    'ane', 'bateau', 'croix', 'demon', 'escargot',
    'femme_caricature', 'femme_danseuse', 'femme_danseuse2', 'femme_danseuse3',
    'femme_danseuse4', 'femme_eventail', 'femme_eventail2', 'femme_guitare',
    'femme_mains_jointes', 'femme_princesse', 'femme_voile', 'femmes_groupe',
    'homme_canne', 'homme_caricature', 'homme_chapeau_baton', 'homme_chapeau',
    'homme_chapeauHaut', 'homme_danseur', 'homme_epee_chapeau', 'homme_faucille',
    'homme_fusil', 'homme_roi', 'homme_soldat', 'monstre1', 'monstre2',
    'ours', 'tour', 'vache'
  ];

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
  };

  constructor(private http: HttpClient) { }

  getFontsBase64(): Observable<string> {
    const options: Object = {
      responseType: 'text',
    };
    return this.http.get<string>(this.fontsBase64Url, options)
      .pipe(
        catchError(this.handleError<string>('getFontsBase64', ''))
      );
  }

  getBgBase64(): Observable<string> {
    const options: Object = {
      responseType: 'text',
    };
    return this.http.get<string>(this.bgBase64Url, options)
      .pipe(
        catchError(this.handleError<string>('getBgBase64', ''))
      );
  }

  getImgsBase64(): Observable<any> {
    const options: Object = {
      responseType: 'text',
    };
    let calls: Array<any> = [];
    this.imgs.forEach(filename => {
      calls.push(this.http.get<string>(this.imgBase64Url + filename + ".txt", options));
    });
    return forkJoin(calls);
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
