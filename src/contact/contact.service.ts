import { Inject, Injectable } from '@nestjs/common';
import { Users } from 'generated/prisma';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { ContactResponse, CreateContact } from 'src/model/contact.model';
import { Logger } from "winston";
import { ContactValidation } from './contact.validation';

@Injectable()
export class ContactService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prisma: PrismaService,
        private validationService: ValidationService
    ) { }

    async create(user: Users, req: CreateContact): Promise<ContactResponse> {
        this.logger.info(`Contact request : Users: ${JSON.stringify(user, (_, v) =>
            typeof v === "bigint" ? v.toString() : v
        )} Contact Data : ${JSON.stringify(req)}`)
        const createReq: CreateContact = this.validationService.validate(ContactValidation.CREATE, req) as CreateContact
        const contact = await this.prisma.contacts.create({
            data: {
                ...createReq,
                id_user: user.id
            }
        })

        return {
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone,
            id: contact.id.toString()
        }
    }
}
