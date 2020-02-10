import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '@services/data.service';
import { Product } from '@models/product';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {

  productForm: FormGroup;
  isLoadingResults = false;

  constructor(private dataService: DataService, private router: Router, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      price: [null, Validators.required],
      imageUrl: ['https://source.unsplash.com/1600x900/?product'],
      quantity: [null, Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.productForm.controls;
  }

  onFormSubmit(value: Partial<Product>) {
    this.isLoadingResults = true;
    this.dataService.addProduct(new Product(value))
      .subscribe((p: Product) => {
        this.isLoadingResults = false;
        this.router.navigate([`home/afteradd/${p.id}`]);
      }, (err) => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }
}
