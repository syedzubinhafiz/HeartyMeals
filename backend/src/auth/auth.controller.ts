import { Controller, Get, Headers, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Controller()
export class AuthController {

    @Get('me')
    me(@Request() req) {
        return req.user;
    }

}
