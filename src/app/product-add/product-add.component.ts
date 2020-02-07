import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DataService } from '../core/services/data.service';
import { Product } from '../core/models/product';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  productForm: FormGroup;

  constructor(private dataService: DataService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      price: [null, Validators.required],
      imageUrl: ['https://source.unsplash.com/1600x900/?product'],
      quantity: [null, Validators.required]
    });
  }

  onFormSubmit(form: NgForm) {
    this.dataService.addProduct(form).pipe(takeUntil(this.destroy$)).subscribe((p: Product) => {
      this.router.navigate([`home/afteradd/${p.id}`]);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
