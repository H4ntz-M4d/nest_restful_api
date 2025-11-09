import { Body, HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { LoginUser, RegisterUser, UserResponse } from 'src/model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { Users } from 'generated/prisma';

@Injectable()
export class UserService {
    constructor(
        private validateService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prisma: PrismaService
    ) {

    }
    async register(req: RegisterUser): Promise<UserResponse> {
        this.logger.info(`Request new user ${JSON.stringify(req)}`)
        const registerReq: RegisterUser = this.validateService.validate(UserValidation.REGISTER, req) as RegisterUser
        const totalUserWithSameUsername = await this.prisma.users.count({
            where: {
                username: registerReq.username
            }
        })

        if (totalUserWithSameUsername > 0) {
            throw new HttpException('Username already exist', 400)
        }

        registerReq.password = await bcrypt.hash(registerReq.password, 10)

        const user = await this.prisma.users.create({
            data: registerReq
        })
        
        return {
            username: user.username,
            name: user.name
        }
    }

    async login(req: LoginUser): Promise<UserResponse> {
        this.logger.info(`User service login : ${JSON.stringify(req)}`)
        const loginReq: LoginUser = this.validateService.validate(UserValidation.LOGIN, req) as LoginUser

        let user = await this.prisma.users.findFirst({
            where: {
                username: loginReq.username
            }
        })

        if (!user) {
            throw new HttpException("Username or password wrong", 401)
        }

        const isPasswordValid = await bcrypt.compare(loginReq.password, user.password)

        if (!isPasswordValid) {
            throw new HttpException("Username or password wrong", 401)
        }

        user = await this.prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                token: uuid()
            }
        })

        return {
            username: user.username,
            name: user.name,
            token: user.token!
        }
    }

    async getUser(user: Users) : Promise<UserResponse> {
        return {
            username: user.username,
            name: user.name
        }
    }
}
