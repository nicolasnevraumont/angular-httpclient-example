import { Component, OnInit } from '@angular/core';
import { DataService } from '../core/services/data.service';
import { Product } from '../core/models/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.sendGetRequest().subscribe((data: Product[]) => {
      console.log(data);
      this.products = data;
    });
  }
}
