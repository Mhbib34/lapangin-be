# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username": "Habib",
  "password": "rahasia",
  "name": "Muhammad Habib",
  "email": "habib@example.com",
  "role": "ADMIN" //enable for create admin
}
```

Response Body (Success) :

```json
{
  "success": true,
  "message": "Created User Successfully",
  "data": {
    "id": "uuid",
    "username": "Habib",
    "password": "rahasia",
    "name": "Muhammad Habib",
    "email": "habib@example.com",
    "isAccountVerified": false,
    "createdAt": "12-12-2025"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Username must not blank, ..."
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "email": "habib@example.com",
  "password": "rahasia"
}
```

Response Body (Success) :

```json
{
  "success":true,
  "message":"User Login Successfully",
  "data": {
    "id":"uuid",
    "username": "Habib",
    "name": "Muhammad Habib",
    "email": "habib@example.com",
    "isAccountVerified": false,
  }
  "token":"jwt"

}
```

Response Body (Failed) :

```json
{
  "errors": "Username or password wrong, ..."
}
```

## Get User

Endpoint : GET /api/users

Request Header :

Cookie: token= jwt

Response Body (Success) :

```json
{
  "success": true,
  "message": "Get User Successfully",
  "data": {
    "id": "uuid",
    "username": "Habib",
    "name": "Muhammad Habib",
    "email": "habib@example.com",
    "isAccountVerified": false,
    "role": "USER" //default user
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Update User

Endpoint : PATCH /api/users

Request Header :

Cookie: token= jwt

Request Body :

```json
{
  "username": "Habib", //tidak wajib
  "password": "rahasia", //tidak wajib
  "name": "Muhammad Habib", //tidak wajib
  "email": "habib@example.com" //tidak wajib
}
```

Response Body (Success) :

```json
{
  "success":true
  "message":"Update User Successfully",
  "data": {
    "id": "uuid",
    "username": "Habib",
    "name": "Muhammad Habib",
    "email": "habib@example.com",
    "isAccountVerified": false,
    "role": "USER" //default user
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Logout User

Endpoint : DELETE /api/users

Request Header :

Cookie: token= jwt

Response Body (Success) :

```json
{
  "success": true,
  "message": "User Logout Successfully"
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Send Reset Password OTP

Endpoint : POST /api/users/send-reset-password-otp

Request Body :

```json
{
  "email": "habib@example.com"
}
```

Response Body (Success) :

```json
{
  "success": true,
  "message": "OTP has sent to your email"
}
```

Response Body (Failed) :

```json
{
  "errors": "Wrong Email, ..."
}
```

## Reset User Password

Endpoint : PATCH /api/users/reset-password

Request Body :

```json
{
  "otp": "123456",
  "email": "habib@example.com",
  "newPassword": "rahasia 2"
}
```

Response Body (Success) :

```json
{
  "success": true,
  "message": "Update password successfully"
}
```

Response Body (Failed) :

```json
{
  "errors": "Expired OTP, ..."
}
```

## Send Verify Email OTP

Endpoint : POST /api/users/send-verify-email-otp

Request Header :

Cookie: token= jwt

Response Body (Success) :

```json
{
  "success": true,
  "message": "Verify email otp has sent to your email"
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Verify Email

Endpoint : PATCH /api/users/verify-email

Request Header :

Cookie: token= jwt

Request Body :

```json
{
  "otp": "123456"
}
```

Response Body (Success) :

```json
{
  "success": true,
  "message": "Verify email successfully"
}
```

Response Body (Failed) :

```json
{
  "errors": "Expired OTP, ..."
}
```
