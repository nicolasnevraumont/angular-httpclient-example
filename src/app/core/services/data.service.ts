import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Product } from '@models/product';
import { catchError, retry, tap } from 'rxjs/operators';
import { MessageService } from '@services/message.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly REST_API_PRODUCTS_PATH = environment.apiUrl + '/products';
  private readonly httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  public first = '';
  public prev = '';
  public next = '';
  public last = '';

  constructor(private httpClient: HttpClient, private messageService: MessageService) {
  }

  public sendGetRequest(): Observable<HttpResponse<Product[]>> {
    // Add safe, URL encoded_page parameter
    // const options = { params: new HttpParams({fromString: '_page=1&_limit=20'}), observe: 'response'};
    // on fail, retries 3 times the httpcall before producing an error
    // TODO: might add some time delay to the retry
    return this.httpClient
      .get<Product[]>(this.REST_API_PRODUCTS_PATH,
        {params: new HttpParams({fromString: '_page=1&_limit=8&_sort=id&_order=desc'}), observe: 'response'})
      .pipe(retry(3), catchError(this.handleError), tap((res: HttpResponse<Product[]>) => {
        this.parseLinkHeader(res.headers.get('Link'));
      }));
  }

  // TODO: DRY code
  public sendGetRequestToUrl(url: string): Observable<HttpResponse<Product[]>> {
    return this.httpClient.get<Product[]>(url, {observe: 'response'}).pipe(retry(3), catchError(this.handleError), tap(res => {
      this.parseLinkHeader(res.headers.get('Link'));
    }));
  }

  public getProduct(id: number): Observable<Product> {
    const url = `${this.REST_API_PRODUCTS_PATH}/${id}`;

    return this.httpClient.get<Product>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  public addProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.REST_API_PRODUCTS_PATH, product, this.httpOptions).pipe(
      tap((p: Product) => this.messageService.add(`The product ${product.name} has been added.`)),
      catchError(this.handleError)
    );
  }

  public deleteProduct(product: Product): Observable<Product> {
    const url = `${this.REST_API_PRODUCTS_PATH}/${product.id}`;

    return this.httpClient.delete<Product>(url, this.httpOptions).pipe(
      tap(_ => this.messageService.add(`The product ${product.name} has been deleted.`)),
      catchError(this.handleError)
    );
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

  parseLinkHeader(header) {
    if (header.length === 0) {
      return;
    }

    const parts = header.split(',');
    const links = {};
    parts.forEach(p => {
      const section = p.split(';');
      const url = section[0].replace(/<(.*)>/, '$1').trim();
      const name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;
    });

    this.first = links['first'];
    this.last = links['last'];
    this.prev = links['prev'];
    this.next = links['next'];
  }
}
