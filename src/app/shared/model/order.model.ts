export class Order {
   customerId: string;
   orderId: string;
   items: [{productId: number, pack: number,
      ratioQty: number}];
   total: number;
   addressDetails: [{
      name: string;
      mobileNumber: number;
      streetAddress: string;
      building: string;
      landmark: string;
      city: string;
      state: string;
      pincode: string;
   }];
   paymentStatus: string;
   orderStatus: string;
   orderDate: Date;
}
