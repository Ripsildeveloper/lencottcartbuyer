import { Component, OnInit, Input, Output,  EventEmitter } from '@angular/core';
import { AccountService } from './../../account.service';
import { Cart } from './../../../shared/model/cart.model';
import { initNgModule } from '@angular/core/src/view/ng_module';
import {MOQ } from './../../../shared/model/moq.model';
import { Router } from '@angular/router';
import { AppSetting } from '../../../config/appSetting';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-checkout-cart',
  templateUrl: './checkout-cart.component.html',
  styleUrls: ['./checkout-cart.component.css']
})
export class CheckoutCartComponent implements OnInit {
@Input() shopModel: any;
@Output() addPlus = new EventEmitter<Cart>();
@Output() minusPlus = new EventEmitter<Cart>();
@Output() deleteCart = new EventEmitter<Cart>();
  cartModel: Cart;
  userId;
  moqModel: MOQ;
  subTotal  = 0;
  action;
  totalItems = 0;
  productImageUrl: string = AppSetting.productImageUrl;
  constructor(private accountService: AccountService, private router: Router, private matSnackBar: MatSnackBar) { }

  ngOnInit() {
  }
  actionPlusData(product)   {
    const totalItem: any = [];
    const cart: any = {
      productId: product,
      pack: 1
    };
    totalItem.push(cart);
    this.addPlus.emit(totalItem);
  }

  actionMinusData(product) {
    const cart: any = {
      productId: product,
      pack: 1
    };
    this.minusPlus.emit(cart);
  }
  total() {
    if (JSON.parse(sessionStorage.getItem('login'))) {
      this.totalQty();
    } else {
    }
  }
  totalQty() {
    let pack = 0;
    this.subTotal = 0;
    this.totalItems = 0;
    const totalProduct: any = this.shopModel.map(item => item.cart_product[0]);
    console.log(totalProduct);
    const totalSet = this.shopModel.map(item => item.items);
    totalSet.map(item => {
      pack += item.pack;
      this.totalItems += item.pack * item.ratioQty;
      const priceSingle = totalProduct.find(test =>  test._id === item.productId);
      this.subTotal += item.pack * item.ratioQty  * priceSingle.price;
    });
  }
  removeCartData(item) {
    this.deleteCart.emit(item);
  }

}
