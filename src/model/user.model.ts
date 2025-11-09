export class RegisterUser {
    username: string
    password: string
    name: string
}

export class UserResponse {
    username: string
    name: string
    token?: string
}

export class LoginUser{
    username: string
    password: string
}

export class UpdateUser{
    username?: string
    password?: string
    name?: string
}