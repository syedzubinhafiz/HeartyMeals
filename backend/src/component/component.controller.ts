import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
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

    @Post()
    async add(@Body() payload: AddComponentDTO){
        return this.componentService.add(payload);
    }
    
    @Post('add/bulk')
    async addBulk(@Body() payload: AddComponentDTO[]){
        return this.componentService.addBulk(payload);
    }

    @Get("ingredients")
    async getIngredients(@Headers() headers: any){
        const authHeader = headers.authorization;
        const decodedHeader = this.commonService.decodeHeaders(authHeader);
        return this.componentService.getComponents(decodedHeader, ComponentType.INGREDIENT);
    }

    @Get("seasonings")
    async getSeasonings(@Headers() headers: any){
        const authHeader = headers.authorization;
        const decodedHeader = this.commonService.decodeHeaders(authHeader);
        return this.componentService.getComponents(decodedHeader, ComponentType.SEASONING);
    }

}
