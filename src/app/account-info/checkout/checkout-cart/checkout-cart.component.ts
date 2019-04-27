import { Component, OnInit, Input, Output,  EventEmitter } from '@angular/core';
import { AccountService } from './../../account.service';
import { Cart } from './../../../shared/model/cart.model';
import { initNgModule } from '@angular/core/src/view/ng_module';
import {MOQ } from './../../../shared/model/moq.model';
import { Router } from '@angular/router';
import { AppSetting } from '../../../config/appSetting';
import { element } from '@angular/core/src/render3';
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
  actionPlusData(product, productSkuCode, productMoq)   {
    const totalItem: any = [];
    const cart = {
      productId: product,
      skuCode: productSkuCode,
      moq: productMoq,
      set: 1
    };
    totalItem.push(cart);
    this.addPlus.emit(totalItem);
  }

  actionMinusData(product, productSkuCode, productMoq) {
    const cart: any = {
      productId: product,
      skuCode: productSkuCode,
      moq: productMoq,
      set: 1
    };
    this.minusPlus.emit(cart);
  }
  total() {
    /* let sum = 0; */

    if (JSON.parse(sessionStorage.getItem('login'))) {
      this.totalQty();
    } else {
    }
  }
  totalQty() {
    let set = 0;
    this.subTotal = 0;
    this.totalItems = 0;
    const totalProduct: any = this.shopModel.map(item => item.cart_product[0]);
    console.log(totalProduct);
    const totalSet = this.shopModel.map(item => item.skuDetail);
    totalSet.map(item => {
      set += item.set;
      this.totalItems += item.set * item.moq;
      const priceSingle = totalProduct.find(test =>  test._id === item.productId);
      this.subTotal += item.set * item.moq  * priceSingle.price;
    });
    sessionStorage.setItem('set', JSON.stringify(set));
  }


  removeCartData(item) {
    this.deleteCart.emit(item);
  }

}
