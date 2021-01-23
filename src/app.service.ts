import { Injectable } from '@nestjs/common';
import * as Shopify from 'shopify-api-node';

@Injectable()
export class AppService {
  shopifyApiKey = process.env.API_KEY;
  shopifyApiPw = process.env.API_PW;
  shopifyBaseURL = `https://${this.shopifyApiKey}:${this.shopifyApiPw}@${process.env.API_DOMAIN}`;
  shopify = new Shopify({
    shopName: process.env.SHOP_NAME,
    apiKey: this.shopifyApiKey,
    password: this.shopifyApiPw,
    apiVersion: '2019-10',
  });

  constructor() {
    this.shopify.on('callLimits', limits => console.log(limits));
    this.shopify.on('callGraphqlLimits', limits => console.log(limits));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
