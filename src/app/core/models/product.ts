export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;

  public constructor(init?: Partial<Product>) {
    Object.assign(this, init);
  }
}
