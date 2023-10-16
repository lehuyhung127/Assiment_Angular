import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IProduct } from 'src/app/interface/product';
import { ProductService } from 'src/app/services/product.service';
import { Event } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ProductListComponent implements OnInit {
  productDialog: boolean = false;

  products!: IProduct[];

  product!: any;

  selectedProducts!: IProduct[] | null;

  submitted: boolean = false;

  statuses!: any[];

  constructor(private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.productService.getAll().subscribe((data: any) => {
      this.products = data.product;
      console.log(data);
    });
  }
  // add product
  addProduct(product: IProduct) {
    this.productService.getCreat(product).subscribe(
      (response) => {
        // Xử lý khi tạo thành công
        alert('Product Created Successfully');
      },
      (error) => {
        // Xử lý khi có lỗi
        console.error('An error occurred:', error);
        alert('Failed to create product');
      }
    );
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
    // Gọi phương thức addProduct để thêm sản phẩm
    // this.addProduct(this.product);

  }

  deleteSelectedProducts() {
    alert('Bạn có muốn xóa không?');
  }

  editProduct(product: IProduct) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(product: any) {
    console.log("id", product);

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Call the deleteProduct method of the ProductService
        this.productService.getDelete(product._id).subscribe(
          () => {
            // Product deletion successful
            this.products = this.products.filter((val) => val._id !== product._id);
            this.product = {};
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
          },
          (error) => {
            // Handle the error
            console.error('An error occurred:', error);
            // Display an error message if needed
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product', life: 3000 });
          }
        );
      }
    });
  }


  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.name.trim()) {
      if (this.product._id) {
        console.log('Product ID:', this.product._id);
        this.productService.getUpdate(this.product).subscribe((value) => {
          console.log('Value update:', value); // Log giá trị cập nhật
          const index = this.findIndexById(this.product._id);
          if (index !== -1) {
            this.products[index] = this.product;
            alert('Update Successful');
            this.productDialog = false;
            this.product = {};
          }
        });
      } else {
        this.product.id = this.createId();
        this.productService.getCreat(this.product).subscribe(() => {

          this.products.push(this.product);
          alert('Creat Successful');
          this.productDialog = false;
          this.product = {};
          location.reload();
        });
      }
    }
  }


  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i]._id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }


}
