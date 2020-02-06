import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Product } from '../models/product';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = environment.apiUrl + '/products';

  constructor(private httpClient: HttpClient) {
  }

  public sendGetRequest(): Observable<Product[]> {
    // on fail, retries 3 times the httpcall before producing an error
    // TODO: might add some time delay to the retry
    return this.httpClient.get<Product[]>(this.REST_API_SERVER).pipe(retry(3), catchError(this.handleError));
  }

  // TODO: move to HttpClient interceptors
  handleError(error: HttpErrorResponse) {
    let errorMessage;
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Server-side error: Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
