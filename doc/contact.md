# Contact API Spec

## Create Contact

Endpoint : POST /api/contacts

Headers

- authorization: token

Request Body :

```json
{
  "id": 1,
  "first_name": "hantz",
  "last_name": "ling",
  "email": "hantz@gmail.com",
  "phone": "0821xxxxxxx"
}
```

Response Body (Success)

```json
{
  "data": {
    "id": 1,
    "first_name": "hantz",
    "last_name": "ling",
    "email": "hantz@gmail.com",
    "phone": "0821xxxxxxx"
  }
}
```

Response Body (Failed)

```json
{
  "errors": ""
}
```

## GET Contact

Endpoint : GET /api/contact/:id_contact

Headers :
- authorization: token

Response Body (Success)

```json
{
  "data": {
    "id": 1,
    "first_name": "hantz",
    "last_name": "ling",
    "email": "hantz@gmail.com",
    "phone": "0821xxxxxxx"
  }
}
```

Response Body (Failed)

```json
{
  "errors": "Unauthorized"
}
```

## UPDATE Contact

Endpoint : PUT /api/contacts/:id_contact

Headers

- authorization: token

Request Body :

```json
{
  "id": 1,
  "first_name": "hantz", // optional
  "last_name": "ling", // optional
  "email": "hantz@gmail.com", // optional
  "phone": "0821xxxxxxx" // optional
}
```

Response Body (Success)

```json
{
  "data": {
    "id": 1,
    "first_name": "hantz",
    "last_name": "ling",
    "email": "hantz@gmail.com",
    "phone": "0821xxxxxxx"
  }
}
```

Response Body (Failed)

```json
{
  "errors": ""
}
```

## Remove Contact

Endpoint : DELETE /api/contact/:id_contact

Headers :

- authorization: token

Response Body (Success)

```json
{
  "data": true
}
```

Response Body (Failed)

```json
{
  "errors": "Unauthorized"
}
```

## Search Contact

Endpoint : GET /api/contact

Headers :
- authorization: token

Query Params :
- name: string, -> search to contact first_name or last_name, optional
- phone: string, -> contact phone, optional
- email: string, -> contact email, optional
- page: number, default 1
- size: number, default 10


Response Body (Success)

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "hantz",
      "last_name": "ling",
      "email": "hantz@gmail.com",
      "phone": "0821xxxxxxx"
    }
  ],
  "paginate": {
    "current_page": 1,
    "total_page": 1,
    "size": 10
  }
}
```

Response Body (Failed)

```json
{
  "errors": "Something wrong"
}
```
