export class WebResponse<T> {
    data?: T
    errors?: string
    paginate?: Paginate
}

export class Paginate {
    size: number
    totalPage: number
    currentPage: number
}