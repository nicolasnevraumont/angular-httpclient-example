import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Product } from '@models/product';
import { DataService } from '@services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit, OnDestroy {

  @Input() product: Product;
  destroy$: Subject<boolean> = new Subject<boolean>(); // used to unsubscribe from http calls if the component is destroyed (closed)

  constructor(private route: ActivatedRoute, private dataService: DataService) {
  }

  ngOnInit(): void {
    if (!this.product) {
      const id = +this.route.snapshot.paramMap.get('productId'); // + transform string to number
      this.dataService.getProduct(id).pipe(takeUntil(this.destroy$))
        .subscribe((product: Product) => this.product = product);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  public deleteProduct(id: number) {
    if (confirm('Do you really want to delete this product?')) {
      // this.removedProductId = id;
      // this.dataService.deleteProduct(id).pipe(delay(2000)).subscribe(_ => this.update$.next(true));
    }
  }
}
