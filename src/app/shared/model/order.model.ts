export class Order {
   customerId: string;
   orderId: string;
   products: [{ skuCode: string, set: number, moq: number }];
   total: string;
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
