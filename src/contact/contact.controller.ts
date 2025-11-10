import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Auth } from 'src/common/auth.decorator';
import type { Users } from 'generated/prisma';
import { ContactResponse, CreateContact } from 'src/model/contact.model';
import { WebResponse } from 'src/model/web.model';

@Controller('api/contact')
export class ContactController {
    constructor(
        private contactService: ContactService
    ) {}

    @Post()
    @HttpCode(200)
    async create(
        @Auth() user: Users,
        @Body() req: CreateContact
    ) : Promise<WebResponse<ContactResponse>> {
        const result = await this.contactService.create(user, req)
        return {
            data: result
        }
    }
}
