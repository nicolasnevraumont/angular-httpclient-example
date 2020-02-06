import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../core/services/data.service';
import { Product } from '../core/models/product';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>(); // used to unsubscribe from http calls if the component is destroyed (closed)

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.sendGetRequest().pipe(takeUntil(this.destroy$)).subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
