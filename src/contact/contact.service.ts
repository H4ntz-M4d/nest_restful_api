import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Contacts, Users } from 'generated/prisma';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { ContactResponse, CreateContact, UpdateContact } from 'src/model/contact.model';
import { Logger } from "winston";
import { ContactValidation } from './contact.validation';

@Injectable()
export class ContactService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prisma: PrismaService,
        private validationService: ValidationService
    ) { }

    toContactResponse = (contact: Contacts): ContactResponse => {
        return {
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone,
            id: contact.id.toString()
        }
    }

    checkContactIsExist = async (userId: bigint, contactId: number): Promise<Contacts> => {
        const contact = await this.prisma.contacts.findFirst({
            where: {
                id_user: userId,
                id: contactId
            }
        })

        if (!contact) {
            throw new HttpException("contact is not found", 404)
        }

        return contact
    }

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

        return this.toContactResponse(contact)
    }

    async getContact(user: Users, contactId: number): Promise<ContactResponse> {
        const contact = await this.checkContactIsExist(user.id, contactId)

        return this.toContactResponse(contact)
    }

    async update(user: Users, req: UpdateContact): Promise<ContactResponse> {
        this.logger.info(`Contact request : Users: ${JSON.stringify(user, (_, v) =>
            typeof v === "bigint" ? v.toString() : v
        )} Contact Data : ${JSON.stringify(req)}`)

        const updateReq: UpdateContact = this.validationService.validate(ContactValidation.UPDATE, req) as UpdateContact

        let contact = await this.checkContactIsExist(user.id, updateReq.id)

        contact = await this.prisma.contacts.update({
            where: {
                id: contact.id,
                id_user: contact.id_user
            },
            data: updateReq
        })

        return this.toContactResponse(contact)
    }

    async remove(user: Users, contactId: number): Promise<ContactResponse> {
        await this.checkContactIsExist(user.id, contactId)

        const contact = await this.prisma.contacts.delete({
            where: {
                id: contactId,
                id_user: user.id
            }
        })

        return this.toContactResponse(contact)
    }
}
