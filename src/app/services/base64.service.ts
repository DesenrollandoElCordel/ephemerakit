import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Base64Service {

  private fontsBase64Url = 'assets/fonts.txt';
  private bgBase64Url = 'assets/bg.txt';
  private friseBase64Url = 'assets/frise.txt';
  private imgBase64Url = 'assets/img/';
  public imgs: Array<any> = [
    { key: 'blank', label: '' },
    { key: 'ane', label: 'Âne' },
    { key: 'bateau', label: 'Bateau' },
    { key: 'croix', label: 'Croix' },
    { key: 'demon', label: 'Démon' },
    { key: 'escargot', label: 'Escargot' },
    { key: 'femme_caricature', label: 'Femme caricature' },
    { key: 'femme_danseuse', label: 'Femme danseuse 1' },
    { key: 'femme_danseuse2', label: 'Femme danseuse 2' },
    { key: 'femme_danseuse3', label: 'Femme danseuse 3' },
    { key: 'femme_danseuse4', label: 'Femme danseuse 4' },
    { key: 'femme_eventail', label: 'Femme éventail 1' },
    { key: 'femme_eventail2', label: 'Femme éventail 2' },
    { key: 'femme_guitare', label: 'Femme guitare' },
    { key: 'femme_mains_jointes', label: 'Femme mains jointes' },
    { key: 'femme_princesse', label: 'Femme princesse' },
    { key: 'femme_voile', label: 'Femme voile' },
    { key: 'femmes_groupe', label: 'Femme groupe' },
    { key: 'homme_canne', label: 'Homme canne' },
    { key: 'homme_caricature', label: 'Homme caricature' },
    { key: 'homme_chapeau_baton', label: 'Homme chapeau bâton' },
    { key: 'homme_chapeau', label: 'Homme chapeau' },
    { key: 'homme_chapeauHaut', label: 'Homme chapeau haut' },
    { key: 'homme_danseur', label: 'Homme danseur' },
    { key: 'homme_epee_chapeau', label: 'Homme épée chapeau' },
    { key: 'homme_faucille', label: 'Homme faucille' },
    { key: 'homme_fusil', label: 'Homme fusil' },
    { key: 'homme_roi', label: 'Homme roi' },
    { key: 'homme_soldat', label: 'Homme soldat' },
    { key: 'monstre1', label: 'Monstre 1' },
    { key: 'monstre2', label: 'Monstre 2' },
    { key: 'ours', label: 'Ours' },
    { key: 'tour', label: 'Tour' },
    { key: 'vache', label: 'Vache' }
  ];

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

  getFriseBase64(): Observable<string> {
    const options: Object = {
      responseType: 'text',
    };
    return this.http.get<string>(this.friseBase64Url, options)
      .pipe(
        catchError(this.handleError<string>('getBgBase64', ''))
      );
  }

  getImgsBase64(): Observable<any> {
    const options: Object = {
      responseType: 'text',
    };
    let calls: Array<any> = [];
    this.imgs.forEach(data => {
      calls.push(this.http.get<string>(this.imgBase64Url + data.key + ".txt", options));
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
