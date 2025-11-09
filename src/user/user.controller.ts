import { Body, Controller, Delete, Get, HttpCode, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUser, RegisterUser, UpdateUser, UserResponse } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { Auth } from 'src/common/auth.decorator';
import type { Users } from 'generated/prisma';

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

    @Get('/current')
    @HttpCode(200)
    async getUser(@Auth() user: Users) : Promise<WebResponse<UserResponse>> {
        const result = await this.userService.getUser(user)
        return {
            data: result
        }
    }

    @Patch('/current')
    @HttpCode(200)
    async update(@Auth() user: Users, @Body() req: UpdateUser) : Promise<WebResponse<UserResponse>> {
        const result = await this.userService.update(user, req)
        return {
            data: result
        }
    }

    @Delete('/current')
    @HttpCode(200)
    async logout(@Auth() user: Users): Promise<WebResponse<true>> {
        await this.userService.logout(user)
        return{
            data: true
        }
    }
}
