import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('customers')
export class CustomersController {
    constructor(
        private customerService: CustomersService
    ) {}

    @Get('/:query/:fetchAll')
    customers(@Param() params): any {
        console.log(decodeURIComponent(params.query));

        let hasNextPage = true;
        let hasPreviousPage = false;
        let customers = [];
        let previous = null;
        let next = null;
        
        let promise = new Promise(async (resolve, reject) => {
            do {
                let query = `sortKey: UPDATED_AT, first:250, query:"${decodeURIComponent(params.query)}"${hasNextPage && next ? `, after: "${next}"` : ''}`;
                const res = await this.customerService.graphql(`{
                    customers(${query})	{
                        pageInfo { # Returns details about the current page of results
                        hasNextPage # Whether there are more results after this page
                        hasPreviousPage # Whether there are more results before this page
                        }
                        edges	{
                            cursor
                                node	{
                                    id
                                    email
                                    tags
                                    firstName
                                    lastName
                                    createdAt
                                    updatedAt
                                    defaultAddress {
                                        id
                                        name
                                        company
                                        address1
                                        address2
                                        city
                                        province
                                        provinceCode
                                        zip
                                        country
                                        countryCodeV2                          
                                      }
                                }
                            }
                        }
                    }`).catch((e) => {
                        reject(e);
                        throw e;
                    });
        
                    // console.log(res);
                hasNextPage = res.customers.pageInfo.hasNextPage;
                hasPreviousPage = res.customers.pageInfo.hasPreviousPage;
                res.customers.edges.forEach((e, i, arr) => {
                    customers.push(e);
                    // save first cursor
                    if(hasPreviousPage && i === 0) {
                        previous = e.cursor;
                    }

                    // save last cursor
                    if(hasNextPage && i === (arr.length - 1)) {
                        next = e.cursor;
                    }
                });
            } while (hasNextPage && params.fetchAll === 'true');
            console.log(params.fetchAll, 'fetchall')
            resolve({
                customers: customers, 
                page: {
                    next: next,
                    prev: previous
            }});
        }).catch((e) => {
            console.log(e);
            throw new HttpException({
              status: HttpStatus.FORBIDDEN,
              error: e.toString(),
            }, HttpStatus.FORBIDDEN);
        });
        return promise;
    }
}
