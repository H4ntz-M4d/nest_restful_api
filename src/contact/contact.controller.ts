import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Auth } from 'src/common/auth.decorator';
import type { Users } from 'generated/prisma';
import { ContactResponse, CreateContact, SearchContact, UpdateContact } from 'src/model/contact.model';
import { WebResponse } from 'src/model/web.model';

@Controller('api/contact')
export class ContactController {
    constructor(
        private contactService: ContactService
    ) { }

    @Post()
    @HttpCode(200)
    async create(
        @Auth() user: Users,
        @Body() req: CreateContact
    ): Promise<WebResponse<ContactResponse>> {
        const result = await this.contactService.create(user, req)
        return {
            data: result
        }
    }

    @Get('/:id')
    @HttpCode(200)
    async getContactById(
        @Auth() user: Users,
        @Param('id', ParseIntPipe) contactId: number
    ): Promise<WebResponse<ContactResponse>> {
        const result = await this.contactService.getContact(user, contactId)
        return {
            data: result
        }
    }

    @Put('/:id')
    @HttpCode(200)
    async update(
        @Auth() user: Users,
        @Param('id', ParseIntPipe) contactId: number,
        @Body() req: UpdateContact
    ): Promise<WebResponse<ContactResponse>> {
        req.id = contactId
        const result = await this.contactService.update(user, req)
        return {
            data: result
        }
    }

    @Delete('/:id')
    @HttpCode(200)
    async remove(
        @Auth() user: Users,
        @Param('id', ParseIntPipe) contactId: number
    ): Promise<WebResponse<boolean>> {
        await this.contactService.remove(user, contactId)
        return {
            data: true
        }
    }

    @Get()
    @HttpCode(200)
    async search(
        @Auth() user: Users,
        @Query('name') name?: string,
        @Query('email') email?: string,
        @Query('phone') phone?: string,
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('size', new ParseIntPipe({ optional: true })) size?: number,
    ): Promise<WebResponse<ContactResponse[]>> {
        const req: SearchContact = {
            name: name,
            email: email,
            phone: phone,
            page: page || 1,
            size: size || 10,
        }
        return this.contactService.search(user, req)
    }
}
