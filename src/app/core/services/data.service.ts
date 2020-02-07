import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Product } from '../models/product';
import { catchError, retry, tap } from 'rxjs/operators';
import { Store } from '../models/applicative/store';

@Injectable({
  providedIn: 'root'
})
export class DataService extends Store<Product[]> {

  private readonly REST_API_PRODUCTS_PATH = environment.apiUrl + '/products';
  private readonly httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private httpClient: HttpClient) {
    super([]);
    this.sendGetRequest().subscribe((products: Product[]) => this.setState(products));
  }

  private sendGetRequest(): Observable<Product[]> {
    // Add safe, URL encoded_page parameter
    // const options = { params: new HttpParams({fromString: '_page=1&_limit=20'}), observe: 'response'};
    // on fail, retries 3 times the httpcall before producing an error
    // TODO: might add some time delay to the retry
    return this.httpClient
      .get<Product[]>(this.REST_API_PRODUCTS_PATH,
        {params: new HttpParams({fromString: '_sort=id&_order=desc'})})
      .pipe(retry(3), catchError(this.handleError));
  }

  public getProducts(): Observable<Product[]> {
    return this.getState();
  }

  public addProduct(product: any): Observable<Product> {
    return this.httpClient.post<Product>(this.REST_API_PRODUCTS_PATH, product, this.httpOptions)
      .pipe(
        tap((p: Product) => {
          const newState = [p, ...this.state$.getValue()];
          this.setState(newState);
        }),
        catchError(this.handleError)
      );
  }

  public deleteProduct(id): void {
    const url = `${this.REST_API_PRODUCTS_PATH}/${id}`;
    this.httpClient.delete<Product>(url, this.httpOptions)
      .pipe(catchError(this.handleError)).subscribe((_) => {
      const newState = this.state$.getValue().filter((p: Product) => p.id !== id);
      this.setState(newState);
    });
  }

  /*
  updateProduct (id, product): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, product, httpOptions).pipe(
      tap(_ => console.log(`updated product id=${id}`)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }
  */

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
