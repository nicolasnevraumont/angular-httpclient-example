import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../core/services/data.service';
import { Product } from '../core/models/product';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>(); // used to unsubscribe from http calls if the component is destroyed (closed)
  update$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getProducts();
    this.update$.subscribe((update: boolean) => update === true ? this.getProducts() : '');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  private getProducts() {
    this.dataService.sendGetRequest().pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<Product[]>) => {
      this.products = res.body;
    });
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

  public deleteProduct(id: number) {
    if (confirm('Do you really want to delete this product?')) {
      this.dataService.deleteProduct(id).subscribe(_ => this.update$.next(true));
    }
  }
}
