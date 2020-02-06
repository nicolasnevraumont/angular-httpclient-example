import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = environment.apiUrl + '/products';

  constructor(private httpClient: HttpClient) {
  }

  public sendGetRequest(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.REST_API_SERVER);
  }
}
