# Booking Api Spec

## Create Booking

Endpoint : POST /api/bookings

Request Header :

- Authorization: Bearer token
- Content-Type: application/json
- Cookie: token= jwt

Request Body :

```json
{
  "fieldId": "string",
  "startTime": "2025-07-20T14:00:00.000Z",
  "endTime": "2025-07-20T15:00:00.000Z"
}
```

Response Body (Success) :

```json
{
  "success": true,
  "message": "Create Booking Successfully",
  "data": {
    "bookingId": "uuid",
    "userId": "uuid",
    "field": {
      "id": "uuid",
      "name": "lapangan merdeka baru",
      "location": "jalan merdeka baru",
      "description": "ini lapangan merdeka baru",
      "image": "string",
      "pricePerHour": 200000,
      "category": "Futsal"
    },
    "startTime": "date time",
    "endTime": "date time",
    "durationHours": 1,
    "totalPrice": 200000,
    "status": "PENDING",
    "createdAt": "date time"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## List Booking

### Admin Only

Endpoint : GET /api/bookings

Request Header :

- Authorization: Bearer token
- Cookie: token= jwt

Response Body (Success) :

```json
{
  "success": true,
  "message": "Create Booking Successfully",
  "data": [
    {
      "bookingId": "uuid",
      "userId": "uuid",
      "field": {
        "id": "uuid",
        "name": "lapangan merdeka baru",
        "location": "jalan merdeka baru",
        "description": "ini lapangan merdeka baru",
        "image": "string",
        "pricePerHour": 200000,
        "category": "Futsal"
      },
      "startTime": "date time",
      "endTime": "date time",
      "durationHours": 1,
      "totalPrice": 200000,
      "status": "PENDING",
      "createdAt": "date time"
    },
    {
      "bookingId": "uuid",
      "userId": "uuid",
      "field": {
        "id": "uuid",
        "name": "lapangan merdeka baru",
        "location": "jalan merdeka baru",
        "description": "ini lapangan merdeka baru",
        "image": "string",
        "pricePerHour": 200000,
        "category": "Futsal"
      },
      "startTime": "date time",
      "endTime": "date time",
      "durationHours": 1,
      "totalPrice": 200000,
      "status": "PENDING",
      "createdAt": "date time"
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

## Get Booking

Endpoint : GET /api/bookings/users/:userId

Request Header :

- Authorization: Bearer token
- Cookie: token= jwt

Response Body (Success) :

```json
{
  "success": true,
  "message": "Create Booking Successfully",
  "data": [
    {
      "bookingId": "uuid",
      "userId": "uuid",
      "field": {
        "id": "uuid",
        "name": "lapangan merdeka baru",
        "location": "jalan merdeka baru",
        "description": "ini lapangan merdeka baru",
        "image": "string",
        "pricePerHour": 200000,
        "category": "Futsal"
      },
      "startTime": "date time",
      "endTime": "date time",
      "durationHours": 1,
      "totalPrice": 200000,
      "status": "PENDING",
      "createdAt": "date time"
    },
    {
      "bookingId": "uuid",
      "userId": "uuid",
      "field": {
        "id": "uuid",
        "name": "lapangan merdeka baru",
        "location": "jalan merdeka baru",
        "description": "ini lapangan merdeka baru",
        "image": "string",
        "pricePerHour": 200000,
        "category": "Futsal"
      },
      "startTime": "date time",
      "endTime": "date time",
      "durationHours": 1,
      "totalPrice": 200000,
      "status": "PENDING",
      "createdAt": "date time"
    }
  ]
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Update Booking Status

### Admin Only

Endpoint : PATCH /api/bookings/:bookingId

Request Header :

- Authorization: Bearer token
- Content-Type: application/json
- Cookie: token= jwt

Request Body :

```json
{
  "status": "CONFIRMED"
}
```

Response Body (Success) :

```json
{
  "success": true,
  "message": "Update Booking Status Successfully"
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Remove Booking

Endpoint : DELETE /api/bookings/:bookingId

Request Header :

- Authorization: Bearer token
- Cookie: token= jwt

Response Body (Success) :

```json
{
  "success": true, //optional, only if not CONFIRMED or COMPLETED
  "message": "Remove Booking Successfully" //optional, only if not CONFIRMED or COMPLETED
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```
