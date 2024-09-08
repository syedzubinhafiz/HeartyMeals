import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { ComponentService } from './component.service';
import { AddComponentDTO } from './dto/add-component-dto';
import { CommonService } from 'src/common/common.service';
import { ComponentType } from './enum/type.enum';

@Controller('component')
export class ComponentController {

    constructor(
        private componentService: ComponentService,
        private commonService: CommonService
    ){}

    /**
     * This endpoint is used to add a new component
     * @param payload component details
     * @returns component added successfully or error message
     */
    @Post()
    async add(@Body() payload: AddComponentDTO){
        return this.componentService.add(payload);
    }
    
    /**
     * Then endpoint is used to add multiple components in a single request
     * @param payload List of components to be added
     * @returns status of the operation
     */
    @Post('add/bulk')
    async addBulk(@Body() payload: AddComponentDTO[]){
        return this.componentService.addBulk(payload);
    }

    /**
     *  This endpoint is used to get all ingredients
     * @param headers request headers which contain user authentication token
     * @param page requested page number
     * @param pageSize 
     * @returns json object containing list of ingredients and pagination details 
     */
    @Get("ingredients")
    async getIngredients(
        @Headers() headers: any,
        @Query("page") page: string,
        @Query("pageSize") pageSize: string,
        @Query("search") search: string = null,

    ) {

        // Extract the authorization header from the request headers
        const auth_header = headers.authorization;
        const decoded_header = this.commonService.decodeHeaders(auth_header);

        // Get the page number and page size
        const page_number = page != undefined ? parseInt(page, 10) : 0;
        const page_size = pageSize != undefined ? parseInt(pageSize, 10) : 0;

        // Check if pagination is required
        let pagination =  false;
        if (page_number != 0 && page_size != 0){
            pagination = true
        }
        

        // Get the list of ingredients
    const [component_list, total] = await this.componentService.getComponents(decoded_header, ComponentType.INGREDIENT, page_number, page_size, pagination, search);
        
        // Return the list of ingredients along with pagination details
        if (pagination){
            return {
                data: component_list,
                total,
                page_number,
                page_size,
                totalPages: Math.ceil(total / page_size)
            };
        } else {
            return {
                data: component_list,
                total
            };
        }
    }
    
    /**
     * This endpoint is used to get all seasonings
     * @param headers request headers which contain user authentication token
     * @param page requested page number
     * @param pageSize 
     * @returns json object containing list of seasonings and pagination details
     */
    @Get("seasonings")
    async getSeasonings(
        @Headers() headers: any,
        @Query("page") page: string,
        @Query("pageSize") pageSize: string,
        @Query("search") search: string = null,

    ) {

        // Extract the authorization header from the request headers
        const auth_header = headers.authorization;
        const decoded_header = this.commonService.decodeHeaders(auth_header);

        const page_number = page != undefined ? parseInt(page, 10) : 0;
        const page_size = pageSize != undefined ? parseInt(pageSize, 10) : 0;

        // Check if pagination is required
        let pagination =  false;
        if (page_number != 0 && page_size != 0){
            pagination = true
        }
        

        // Get the list of seasonings
        const [component_list, total] = await this.componentService.getComponents(decoded_header, ComponentType.SEASONING, page_number, page_size, pagination, search);
        

        // Return the list of seasonings along with pagination details
        if (pagination){
            return {
                data: component_list,
                total,
                page_number,
                page_size,
                totalPages: Math.ceil(total / page_size)
            };
        } else {
            return {
                data: component_list,
                total
            };
        }
    }


    //

}
