import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import * as bcrypt from 'bcrypt';
import { Users } from "generated/prisma";

@Injectable()
export class TestService{
    constructor(private prisma: PrismaService) {}

    async deleteUsers() {
        await this.prisma.users.deleteMany({
            where: {
                username: 'test'
            }
        })
    }

    async createUser() {
        await this.prisma.users.create({
            data: {
                username: 'test',
                name: 'test',
                password: await bcrypt.hash('test', 10),
                token: 'test'
            }
        })
    }

    async getUser() : Promise<Users | null> {
        return this.prisma.users.findFirst({
            where: {
                username: 'test'
            }
        })
    }
}