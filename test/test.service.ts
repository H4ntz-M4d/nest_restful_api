import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import * as bcrypt from 'bcrypt';
import { Contacts, Users } from "generated/prisma";

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

    async deleteContact() {
        await this.prisma.contacts.deleteMany({
            where: {
                id_user: 1
            }
        })
    }

    async createUser() {
        await this.prisma.users.create({
            data: {
                id: 1,
                username: 'test',
                name: 'test',
                password: await bcrypt.hash('test', 10),
                token: 'test'
            }
        })
    }

    async createContact() {
        await this.prisma.contacts.create({
            data: {
                id: 1,
                first_name: 'test',
                last_name: 'test',
                email: 'test@gmail.com',
                phone: '0845678901',
                id_user: 1
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

    async getContact() : Promise<Contacts | null> {
        return this.prisma.contacts.findFirst({
            where: {
                id_user: 1
            }
        })
    }
}