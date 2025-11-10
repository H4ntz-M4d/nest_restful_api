export class ContactResponse {
    id: string
    first_name: string
    last_name?: string | null
    email?: string | null
    phone?: string | null
}

export class CreateContact{
    first_name: string
    last_name?: string
    email?: string
    phone?: string
}