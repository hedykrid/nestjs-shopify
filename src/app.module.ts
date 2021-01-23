import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { CustomersService } from './customers/customers.service';
import { CustomersController } from './customers/customers.controller';
import { Route4meService } from './services/route4me/route4me.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, OrdersController, CustomersController],
  providers: [AppService, OrdersService, CustomersService, Route4meService],
})
export class AppModule {}
