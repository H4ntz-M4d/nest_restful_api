# User API Spec

## Register User

Endpoint : POST /api/users

```json
{
  "username": "hantz",
  "password": "rahasia",
  "name": "Ince Ahmad",
}
```

Response Body (Success)
```json
{
  "data": {
    "id": 1,
    "username": "hantz",
    "name": "Ince Ahmad",
  }
}
```
Response Body (Failed)

```json

{
    "errors": "Username already exist"
}

```

## Login User

Endpoint : POST /api/users/login

```json
{
  "username": "hantz",
  "password": "rahasia",
}
```

Response Body (Success)
```json
{
  "data": {
    "id": 1,
    "username": "hantz",
    "name": "Ince Ahmad",
    "token": "session_id_generated",
  }
}
```
Response Body (Failed)

```json

{
    "errors": "Username or password is wrong"
}

```

## Get User

Endpoint : GET /api/users/current

Headers :
- authorization: token

Response Body (Success)
```json
{
  "data": {
    "id": 1,
    "username": "hantz",
    "name": "Ince Ahmad",
  }
}
```
Response Body (Failed)

```json

{
    "errors": "Unauthorized"
}

```

## Update User

Endpoint : PATCH /api/users/current

Headers :
- authorization: token

```json
{
  "id": 1,
  "username": "hantz",  // optional
  "password": "rahasia",  // optional
  "name": "Ince Ahmad", // optional
}
```

Response Body (Success)
```json
{
  "data": {
    "id": 1,
    "username": "hantz",
    "name": "Ince Ahmad",
  }
}
```
Response Body (Failed)

```json

{
    "errors": "Unauthorized"
}

```

## Logout User

Endpoint : PATCH /api/users/current

Headers :
- authorization: token // hapus token

Response Body (Success)
```json
{
  "data": true
}
```
Response Body (Failed)

```json

{
    "errors": "Something wrong"
}

```