import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUser, RegisterUser, UserResponse } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';

@Controller('api/users')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post()
    @HttpCode(200)
    async register(
        @Body() req: RegisterUser
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.register(req)
        return {
            data: result
        }
    }

    @Post('/login')
    @HttpCode(200)
    async login(
        @Body() req: LoginUser
    ) : Promise<WebResponse<UserResponse>>{
        const result = await this.userService.login(req)
        return {
            data: result
        }
    }
}
