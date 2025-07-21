# Field API Spec

## Create Field

### Admin Only

Endpoint : POST /api/field

Request Header :

- Authorization: Bearer <admin_token>
- Content-Type: application/json
- Cookie: token= jwt

Request Body :

```json
{
  "name": "lapangan merdeka",
  "location": "jalan merdeka",
  "description": "ini lapangan merdeka", //not required
  "image": "string", //not required
  "pricePerHour": 200000,
  "category": "Futsal" // can be the name of an existing category or a new category
}
```

Response Body (Success) :

```json
{
  "success": true,
  "message": "Create Field Successfully",
  "data": {
    "id": "uuid",
    "name": "lapangan merdeka",
    "location": "jalan merdeka",
    "description": "ini lapangan merdeka",
    "image": "string",
    "pricePerHour": 200000,
    "category": "Futsal"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Update Field

### Admin Only

Endpoint : PATCH /api/field/:fieldId

Request Header :

- Authorization: Bearer <admin_token>
- Content-Type: application/json
- Cookie: token= jwt

Request Body :

```json
{
  "name": "lapangan merdeka baru", //not required
  "location": "jalan merdeka baru", //not required
  "description": "ini lapangan merdeka baru", //not required
  "image": "string", //not required
  "pricePerHour": 200000, //not required
  "category": "Futsal" //not required, can be the name of an existing category or a new category
}
```

Response Body (Success) :

```json
{
  "success": true,
  "message": "Updated Field Successfully",
  "data": {
    "id": "uuid",
    "name": "lapangan merdeka baru",
    "location": "jalan merdeka baru",
    "description": "ini lapangan merdeka baru",
    "image": "string",
    "pricePerHour": 200000,
    "category": "Futsal"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Get Field

Endpoint : GET /api/field/:fieldId

Request Header :

- Authorization: Bearer token
- Cookie: token= jwt

Response Body (Success) :

```json
{
  "success": true,
  "message": "Get Field Successfully",
  "data": {
    "id": "uuid",
    "name": "lapangan merdeka baru",
    "location": "jalan merdeka baru",
    "description": "ini lapangan merdeka baru",
    "image": "string",
    "pricePerHour": 200000,
    "category": "Futsal"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Field is nor found, ..."
}
```

## Search Field

Endpoint : GET /api/field

Query Parameter :

- name : string, contact first name or contact last name, optional
- location : string, contact location, optional
- page : number, default 1
- size : number, default 10

Request Header :

- Authorization: Bearer token
- Cookie: token= jwt

Response Body (Success) :

```json
{
  "success": true,
  "message": "Search Field Successfully",
  "data": [
    {
      "id": "uuid",
      "name": "lapangan merdeka baru",
      "location": "jalan merdeka baru",
      "description": "ini lapangan merdeka baru",
      "image": "string",
      "pricePerHour": 200000,
      "category": "Futsal"
    },
    {
      "id": "uuid",
      "name": "lapangan merdeka baru",
      "location": "jalan merdeka baru",
      "description": "ini lapangan merdeka baru",
      "image": "string",
      "pricePerHour": 200000,
      "category": "Futsal"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Remove Field

### Admin Only

Endpoint : DELETE /api/field/:fieldId

Request Header :

- Authorization: Bearer token
- Cookie: token= jwt

Response Body (Success) :

```json
{
  "success": true,
  "message": "Remove Field Successfully"
}
```

Response Body (Failed) :

```json
{
  "errors": "Field is nor found, ..."
}
```
