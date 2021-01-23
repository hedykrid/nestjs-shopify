import { Injectable } from '@nestjs/common';
import { AppService } from '../../src/app.service';

@Injectable()
export class OrdersService {
    constructor(
        private appService: AppService,
    ){}
    list(): any {
        return this.appService.shopify.order
        .list({ limit: 250 })
        .then((orders) => {return orders})
        .catch((err) => console.error(err));
    }
}
