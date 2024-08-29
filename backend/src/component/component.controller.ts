import { Body, Controller, Post } from '@nestjs/common';
import { ComponentService } from './component.service';
import { AddComponentDTO } from './dto/add-component-dto';

@Controller('component')
export class ComponentController {

    constructor(
        private componentService: ComponentService
    ){}

    /**
     * This endpoint is used to add a new component
     * @param payload component details
     * @returns component added successfully or error message
     */
    @Post('add')
    async add(@Body() payload: AddComponentDTO){
        return this.componentService.add(payload);
    }
}
