import { Component, OnInit } from '@angular/core';
import { ProductService } from './../product.service';
import { Product } from '../../shared/model/product.model';
import { Cart } from './../../shared/model/cart.model';
import { initNgModule } from '@angular/core/src/view/ng_module';
import {MOQ} from '../../shared/model/moq.model';
import { Router } from '@angular/router';
import { AppSetting } from '../../config/appSetting';
import { element } from '@angular/core/src/render3';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  shopModel: any = [];
  cartModel: Cart;
  userId;
  moqModel: MOQ;
  subTotal  = 0;
  action;
  totalItems = 0;
  productImageUrl: string = AppSetting.productImageUrl;
  constructor(private productService: ProductService, private router: Router, private matSnackBar: MatSnackBar) { }

  ngOnInit() {
    if (JSON.parse(sessionStorage.getItem('login'))) {
      this.userId = sessionStorage.getItem('userId');
      this.shoppingCartUser(this.userId);
    } else {
      this.shopModel = JSON.parse(sessionStorage.getItem('cart')) || [];
    }
  }
  actionPlus(product) {
    const totalItem: any = [];
    const cart = {
      productId: product,
      pack: 1
    };
    totalItem.push(cart);
    this.cartModel = new Cart();
    this.cartModel.userId = this.userId;
    this.cartModel.items = totalItem;
    this.productService.addToCart(this.cartModel).subscribe(data => {
    this.shopModel = data;
    }, error => {
      console.log(error);
    });
  }
  actionMinus(product) {
    const cart: any = {
      productId: product,
      pack: 1
    };
    this.cartModel = new Cart();
    this.cartModel.userId = this.userId;
    this.cartModel.items = cart;
    this.productService.addToCartDecrement(this.cartModel).subscribe(data => {
    this.shopModel = data;
    this.total();
    }, error => {
      console.log(error);
    });
  }
  clearFromCart(product) {
    const item = this.shopModel.find(ite => {
      return ite.productId === product.productId;
    });
    const index = this.shopModel.indexOf(item);
    this.shopModel.splice(index, 1);
    sessionStorage.setItem('cart', JSON.stringify(this.shopModel));
  }
  total() {
    if (JSON.parse(sessionStorage.getItem('login'))) {
      this.totalQty();
    } else {
      /* const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
      cart.map(item => {
        sum += item.set * item.moq * item.price;
      });
      return sum; */
    }
  }
  orderPlaced()   {
    this.matSnackBar.open('order Placed Successfully', this.action, {
      duration: 2000,
    });
    this.router.navigate(['home/welcome']);
  }
  totalQty() {
    let pack = 0;
    this.subTotal = 0;
    this.totalItems = 0;
    const totalProduct: any = this.shopModel.map(item => item.cart_product[0]);
    const totalSet = this.shopModel.map(item => item.items);
    totalSet.map(item => {
      pack += item.pack;
      this.totalItems += item.pack;
      const priceSingle = totalProduct.find(test =>  test._id === item.productId);
      this.subTotal += item.pack * item.ratioQty  * priceSingle.price;
    });
    sessionStorage.setItem('pack', JSON.stringify(pack));
  }
  shoppingCartUser(userId) {
    this.productService.shoppingUser(userId).subscribe(data => {
    this.shopModel = data;
    this.total();
    }, err => {
      console.log(err);
    });
  }

 /*  minusCart(userId, product) {
    const item: any = {
      productId: product.productId,
      productName: product.productName,
      productDescription: product.productDescription,
      productImageName: product.productImageName,
      price: product.price,
      subTotal: product.price * 1,
      set: 1
    };
    this.cart = new Cart();
    this.cart.userId = userId;
    this.cart.skuDetail = item;
    this.productService.addToCartMinus(this.cart).subscribe(data => {
      this.shopModel = data;
    }, err => {
      console.log(err);
    });
  } */
  /*   reduceCart(proId) {
     this.productService.reduceToCart(proId).subscribe(data => {
       this.shopModel = data;
       localStorage.setItem('cart', JSON.stringify(data));
     }, err => {
       console.log(err);
     });
   }*/
  removeCart(item) {
    this.productService.deleteToCart(this.userId, item).subscribe(data => {
      this.shopModel = data;
      this.total();
    }, err => {
      console.log(err);
    });
  }
  placeOrder() {
    if (JSON.parse(sessionStorage.getItem('login'))) {
      this.router.navigate(['product/placeorder']);
      sessionStorage.setItem('orderSummary', JSON.stringify(this.shopModel));
    } else {
    this.router.navigate(['account/signin']);
   }
  }
}
