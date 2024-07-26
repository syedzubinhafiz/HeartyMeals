import { Body, Controller, Post } from '@nestjs/common';
import { ComponentService } from './component.service';
import { AddComponentDTO } from './dto/add-component-dto';

@Controller('component')
export class ComponentController {

    constructor(
        private componentService: ComponentService
    ){}

    @Post()
    async add(@Body() payload: AddComponentDTO){
        return this.componentService.add(payload);
    }
}
