import { Body, Controller, Get, Header, Headers, HttpException, Post, Query } from '@nestjs/common';
import { ComponentService } from './component.service';
import { AddComponentDTO } from './dto/add-component-dto';
import { CommonService } from 'src/common/common.service';
import { ComponentType } from './enum/type.enum';
import { StorageService } from 'src/storage/storage.service';
import { EntityManager } from 'typeorm';
import { Component } from './component.entity';

@Controller('component')
export class ComponentController {

    constructor(
        private componentService: ComponentService,
        private commonService: CommonService,
        private readonly entityManager: EntityManager,
        private storageService: StorageService,
    ){}

    /**
     * This endpoint is used to add a new component
     * @param payload component details
     * @returns component added successfully or error message
     */
    @Post('add')
    async add(@Body() payload: AddComponentDTO){
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                const new_component = await this.componentService.add(payload.component, transactionalEntityManager) as Component;

                // get path for component
                const upload_path = this.componentService.getPath(new_component.foodCategory.id, new_component.id);

                if (payload.files != undefined){
                    payload.files.path = upload_path;

                    await this.storageService.handleUpload(payload.files, new_component, Component, transactionalEntityManager);
                }
            });
            return new HttpException("Component added successfully", 200);
        } catch (e) {
            console.error('Transaction failed:', e);
            throw new HttpException(e.message, 400);
        }
    }
    
    /**
     * Then endpoint is used to add multiple components in a single request
     * @param payload List of components to be added
     * @returns status of the operation
     */
    @Post('add/bulk')
    async addBulk( @Body() payload: AddComponentDTO[]){
        try {
            const components = payload.map((component) => component.component);
            await this.entityManager.transaction(async transactionalEntityManager => {
                const new_components = await this.componentService.addBulk(components, transactionalEntityManager) as Component[];

                for (const [index, new_component] of new_components.entries()) {
                    // get path for component
                    const upload_path = this.componentService.getPath(new_component.foodCategory.id, new_component.id);

                    const files = payload[index].files;
                    files.path = upload_path;
    
                    console.log("uploading component files");
                    if (files != undefined) {
                        await this.storageService.handleUpload(files, new_component, Component, transactionalEntityManager);
                        console.log("Files uploaded successfully");
                    }
                }
            });
            return new HttpException("Component added successfully", 200);
        } catch (e) {
            console.error('Transaction failed:', e);
            throw new HttpException(e.message, 400);
        }
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



}
