import { Injectable, HttpService } from '@nestjs/common';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { rejects } from 'assert';
import { AppService } from 'src/app.service';

@Injectable()
export class CustomersService {
    
    constructor(
        private appService: AppService,
        private httpService: HttpService,
    ){}
    
    count(query): any {
        
        return this.appService.shopify.customer
        .count({ 
            limit: 250,
            query: query,
        })
        .then((customers) => {
            return customers
        })
        .catch((err) => console.error(err));
    }
    list(query): any {
        
        return this.appService.shopify.customer
        .list({ 
            limit: 250,
            query: query,
        })
        .then((customers) => {
            return customers
        })
        .catch((err) => console.error(err));
    }
    // async listPaginated(query): any {
        
    //     let params = { limit: 10 };

    //     do {
    //       const products = await this.appService.shopify.product.list(params);
      
    //       console.log(products);
      
    //       params = products.nextPageParameters;
    //     } while (params !== undefined);


    //     // .then((customers) => {
    //     //     return customers
    //     // })
    //     // .catch((err) => console.error(err));
    // }
    
    search(query): any {
        console.log('query', query);    
        // return this.appService.shopify.customer
        // .search({ 
        //     limit: 250,
        //     query: query,
        // })
        // .then((customers) => {
        //     return customers
        // })
        // .catch((err) => console.error(err));

        let promise = new Promise(async (resolve, reject) => {

            let customers = [];
            let params = { 
                limit: 250,
                query: query,
            };

            do {
            const res = await this.appService.shopify.customer
            .search(params).catch(e => console.log(e));
        
            console.log(res.nextPageParameters);
            res.forEach(e => {
                customers.push(e);
            });
            
            params = res.nextPageParameters;


            } while (params !== undefined);

            resolve(customers);
        }).catch(e => {
            throw e;
        });
        return promise;

    }
    searchNew(query): Observable<AxiosResponse<any>> {
        // console.log(`${this.appService.shopifyBaseURL}/admin/api/2020-04/customers/search.json
        // ?query="${query}"
        // &limit=50`);
        
        return this.httpService.get(
            `${this.appService.shopifyBaseURL}/admin/api/2020-04/customers/search.json?query=${query}&limit=250`
        );
    }
    async graphql(query): Promise<any> {
        // let count = 0;
        if (this.appService.shopify.callGraphqlLimits.remaining < 500) {
            // do {
                // count++
                // console.log(count);
                console.log((this.appService.shopify.callGraphqlLimits.current / 50) * 500)
                await this.appService.sleep((this.appService.shopify.callGraphqlLimits.current / 50) * 500);
                
            // } while (this.appService.shopify.callGraphqlLimits.remaining < 500 && count < 1);
        }

        return this.appService
        .shopify
        .graphql(query)
        .catch(e => {
            console.log(e);
            throw e;
        });
    }
}
