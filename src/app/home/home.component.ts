import { Component, OnInit } from '@angular/core';
import { DataService } from '../core/services/data.service';
import { Product } from '../core/models/product';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private highlightedProductId = '';

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log(params);
      this.highlightedProductId = params.get('productId');
    });
  }

  public isHighlighted(productId: number) {
    return this.highlightedProductId === productId.toString();
  }

  public get products$(): Observable<Product[]> {
    return this.dataService.getProducts();
  }

  public deleteProduct(id: number) {
    if (confirm('Do you really want to delete this product?')) {
      this.dataService.deleteProduct(id);
    }
  }
}
