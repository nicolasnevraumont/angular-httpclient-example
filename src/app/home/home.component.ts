import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '@services/data.service';
import { Product } from '@models/product';
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>(); // used to unsubscribe from http calls if the component is destroyed (closed)
  update$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private highlightedProductId = '';
  private removedProductId = -1;

  constructor(private dataService: DataService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.highlightedProductId = params.get('productId');
    });
    this.getProducts();
    this.update$.subscribe((update: boolean) => update === true ? this.refreshProducts() : '');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  private refreshProducts() {
    this.highlightedProductId = ''; // might refresh with productId URL parameter affected to highlightedProductId but in this case
    // the effect is not wanted
    this.getProducts();
  }

  private getProducts() {
    this.dataService.sendGetRequest().pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<Product[]>) => {
      this.products = res.body;
    });
  }

  public isHighlighted(productId: number) {
    return this.highlightedProductId === productId.toString();
  }

  public isRemoved(productId: number) {
    return this.removedProductId === productId;
  }

  // TODO: DRY code
  // TODO: Make visible or not depending on context (e.g. no prev button on first page...)
  // TODO: Virtual scrolling?
  public firstPage() {
    this.products = [];
    this.dataService.sendGetRequestToUrl(this.dataService.first).pipe(takeUntil(this.destroy$))
      .subscribe((res: HttpResponse<Product[]>) => {
        this.products = res.body;
      });
  }

  public previousPage() {
    if (this.dataService.prev !== undefined && this.dataService.prev !== '') {
      this.products = [];
      this.dataService.sendGetRequestToUrl(this.dataService.prev).pipe(takeUntil(this.destroy$))
        .subscribe((res: HttpResponse<Product[]>) => {
          this.products = res.body;
        });
    }

  }

  public nextPage() {
    if (this.dataService.next !== undefined && this.dataService.next !== '') {
      this.products = [];
      this.dataService.sendGetRequestToUrl(this.dataService.next).pipe(takeUntil(this.destroy$))
        .subscribe((res: HttpResponse<Product[]>) => {
          this.products = res.body;
        });
    }
  }

  public lastPage() {
    this.products = [];
    this.dataService.sendGetRequestToUrl(this.dataService.last).pipe(takeUntil(this.destroy$))
      .subscribe((res: HttpResponse<Product[]>) => {
        this.products = res.body;
      });
  }

  public deleteProduct(product: Product) {
    if (confirm('Do you really want to delete this product?')) {
      this.removedProductId = product.id;
      this.dataService.deleteProduct(product).pipe(delay(2000)).subscribe(_ => this.update$.next(true));
    }
  }
}
