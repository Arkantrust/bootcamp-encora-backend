import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private apiKey: string;
  private merchantId: string;
  private payuUrl: string;
  private accountId: string;
  private description: string;
  private referenceCode: string;
  private amount: number;
  private tax: number;
  private taxReturnBase: number;
  private currency: string;
  private signature: string;
  private test: number;
  private responseUrl: string;
  private confirmationUrl: string;
  private buyerEmail: string;
  private address: string;
  private city: string;


  constructor(

    private configService: ConfigService,

  ) {
    this.apiKey = this.configService.get<string>('PAYU_API_KEY');
    this.merchantId = this.configService.get<string>('PAYU_MERCHANT_ID');
    this.payuUrl = this.configService.get<string>('PAYU_URL');
    this.accountId = this.configService.get<string>('PAYU_ACCOUNT_ID');
    this.responseUrl = this.configService.get<string>('PAYU_RESPONSE_URL');
    this.confirmationUrl = this.configService.get<string>('PAYU_CONFIRMATION_URL');
    this.test = +this.configService.get<string>('TEST_FLAG');
    this.currency = this.configService.get<string>('CURRENCY');
    this.description = this.configService.get<string>('DESCRIPTION');

  }
  generateFormSignature(apiKey:string,merchantId:string, referenceCode:string, amount:string,currency:string): string {
    const hashString = `${apiKey}~${merchantId}~${referenceCode}~${amount}~${currency}`;
    return crypto.createHash('md5').update(hashString).digest('hex');
  }

  generatePaymentHtml(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Redirecting to Payment...</title>
      </head>
      <body onload="document.getElementById('payuForm').submit();">
          <form id="payuForm" action="${this.payuUrl}" method="post">
              <input type="hidden" name="merchantId" value="${this.merchantId}" />
              <input type="hidden" name="accountId" value="${this.accountId}" />
              <input type="hidden" name="description" value="${this.description}" />
              <input type="hidden" name="referenceCode" value="${this.referenceCode}" />
              <input type="hidden" name="amount" value="${this.amount}" />
              <input type="hidden" name="tax" value="${this.tax}" />
              <input type="hidden" name="taxReturnBase" value="${this.taxReturnBase}" />
              <input type="hidden" name="currency" value="${this.currency}" />
              <input type="hidden" name="signature" value="${this.signature}" />
              <input name="test" type="hidden" value="${this.test}">
              <input type="hidden" name="responseUrl" value="${this.responseUrl}" />
              <input type="hidden" name="confirmationUrl" value="${this.confirmationUrl}" />
              <input type="hidden" name="buyerEmail" value="${this.buyerEmail}" />
              <input name="shippingAddress"    type="hidden"  value="${this.address}"   >
              <input name="shippingCity"       type="hidden"  value="${this.city}" >
              <input name="shippingCountry"    type="hidden"  value="CO"  >
          </form>
      </body>
      </html>
    `;
  }
  
  generatePaymentLink(amount:number,referenceCode:string,buyerEmail:string, address:string,city:string): string {
    this.amount=amount;
    this.referenceCode=referenceCode;
    this.buyerEmail=buyerEmail;
    this.amount=amount;
    this.city=city
    this.address=address
    this.signature = this.generateFormSignature(this.apiKey,this.merchantId, this.referenceCode, this.amount.toString(),this.currency);
    this.tax = this.amount * 0.19;
    this.taxReturnBase = this.amount - this.tax;

    return this.generatePaymentHtml();
  }
 

}
