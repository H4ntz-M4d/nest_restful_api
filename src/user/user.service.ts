import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { RegisterUser, UserResponse } from 'src/model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from "bcrypt";

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
}
