import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
/* import { ProductService } from '../product.service';
import { Product } from '../../shared/model/product.model';
import {SingleProductOrder} from '../../shared/model/singleProductOrder.model';
import {AddressModel} from '../../account-info/address/address.model';
import {Order} from '../../shared/model/order.model'; */
import { AddressModel } from './../../address/address.model';
import { RegModel } from './../../registration/registration.model';
import { AddressService } from './../../address/address.service';
import { AccountService } from './../../account.service';
import { Cart } from './../../../shared/model/cart.model';
import { Order } from './../../../shared/model/order.model';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
  userId: string;
  addressModel: AddressModel[];
  regModel: RegModel;
  orderForm: FormGroup;
  shopModel: any = [];
  cartModel: Cart;
  id;
  order: Order;
  orderModel: Order;
  /* productModel: Product;
  orderModel: Order; */
  message;
  action;
  moqModel;
  changingQty;
  totalValue;
  calculatedPrice;
  loginStatus;
  billingDetails: any;
  addAddressDetails: boolean;
  /* addressHolder: AddressModel; */
  orderSummary: any;
  sumValue: any;
  addressSelected: AddressModel;
  subTotal = 0;
  totalItems = 0;
  /* private productService: ProductService */
  constructor(private fb: FormBuilder, private route: ActivatedRoute,
              private snackBar: MatSnackBar, private router: Router, private addressService: AddressService,
              private accountService: AccountService) { }

  ngOnInit() {
    this.createForm();
    /* this.viewSingleProduct(); */
    this.loginStatus = sessionStorage.getItem('login');
    this.userId = sessionStorage.getItem('userId');
    this.getAddress();
    if (JSON.parse(sessionStorage.getItem('login'))) {
      this.userId = sessionStorage.getItem('userId');
      this.shoppingCartUser(this.userId);
    } else {
      this.shopModel = JSON.parse(sessionStorage.getItem('cart')) || [];
    }
  }

  actionPlus(totalItem) {
    this.cartModel = new Cart();
    this.cartModel.userId = this.userId;
    this.cartModel.skuDetail = totalItem;
    this.accountService.addToCart(this.cartModel).subscribe(data => {
      this.shopModel = data;
      this.total();
    }, error => {
      console.log(error);
    });
  }
  actionMinus(totalItem) {
    this.cartModel = new Cart();
    this.cartModel.userId = this.userId;
    this.cartModel.skuDetail = totalItem;
    this.accountService.addToCartDecrement(this.cartModel).subscribe(data => {
      this.shopModel = data;
      this.total();
    }, error => {
      console.log(error);
    });
  }
  removeCart(item) {
    this.accountService.deleteToCart(this.userId, item).subscribe(data => {
      this.shopModel = data;
      this.total();
    }, err => {
      console.log(err);
    });
  }
  createForm() {
    this.orderForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      emailId: [''],
      streetAddress: [''],
      building: [''],
      landmark: [''],
      city: [''],
      state: [''],
      pincode: [''],
      qty: [''],
      productPrice: [''],
      totalPrice: ['']
    });
  }

  getAddress() {
    this.accountService.getCustomerDetails(this.userId).subscribe(data => {
      this.regModel = data;
      this.addressModel = data.addressDetails;
      this.addressSelected = this.addressModel[0];
    }, error => {
      console.log(error);
    });
  }
  addAddress() {
    this.addressService.openAddress().subscribe(
      res => {
        if (res) {
          this.getAddress();
        }
      }
    );
  }
  selectedAddress(event) {
    if (event) {
      this.addressSelected = event;
    }
  }
  editAddress(data) {
    console.log(data);
    this.addressService.editAddress(data).subscribe(
      res => {
        if (res) {
          this.getAddress();
        }
      }
    );
  }

  orderConfirmDetails(address, total) {
    const totalItem = this.shopModel.map(element => element.skuDetail);
    this.orderModel = new Order();
    this.orderModel.customerId = this.userId;
    this.orderModel.addressDetails = address;
    this.orderModel.products = totalItem;
    this.orderModel.total = total;
    this.accountService.confirmOrder(this.orderModel).subscribe(data => {
    this.orderModel = data;
    }, err => {
      console.log(err);
    });
  }
  shoppingCartUser(userId) {
    this.accountService.shoppingUser(userId).subscribe(data => {
      this.shopModel = data;
      this.total();
    }, err => {
      console.log(err);
    });
  }
  deleteData(addressId) {
    this.accountService.customerAddressDelete(this.userId, addressId).subscribe(data => {
      this.regModel = data;
      this.addressModel = data.addressDetails;
      this.addressSelected = this.addressModel[0];
    }, error => {
      console.log(error);
    });
  }


  total() {
    /* let sum = 0; */

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
  /* orderPlaced()   {
    this.matSnackBar.open('order Placed Successfully', this.action, {
      duration: 2000,
    });
    this.router.navigate(['home/welcome']);
  } */
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
      const priceSingle = totalProduct.find(test => test._id === item.productId);
      this.subTotal += item.set * item.moq * priceSingle.price;
    });
    sessionStorage.setItem('set', JSON.stringify(set));
  }
  reduceQty(qty, price) {
    this.changingQty = +qty - this.moqModel.moqQuantity;
    this.calculatedPrice = +price * this.changingQty;
  }
  increaseQty(qty, price) {
    this.changingQty = +qty + this.moqModel.moqQuantity;
    this.calculatedPrice = +price * this.changingQty;
  }

}