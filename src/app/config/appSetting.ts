import { environment } from '../../environments/environment';
export const AppSetting: AppSettingType = {
    awsServiceUrl: 'http://ec2-13-126-16-163.ap-south-1.compute.amazonaws.com:3002/',
    local3021CrmServiceUrl: 'http://localhost:3002/',
    serviceUrl: environment.serviceUrl,
    /* serviceUrl: 'https://rinteger.com/adminservice/' */
    /* productImageUrl: 'http://localhost/Lencott/products/', */
    productImageUrl: 'https://benjolb2b.com/admin/images/product/',
    clientName: 'Lencott'
   /* serviceUrl: 'http://ec2-13-233-199-18.ap-south-1.compute.amazonaws.com/service/' */
};
