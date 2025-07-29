# Category API Spec

## List Category

Endpoint : GET /api/categoris

Response Body (Success) :

```json
{
  "success": true,
  "message": "List category successfully",
  "data": [
    {
      "id": "uuid",
      "name": "category"
    },
    {
      "id": "uuid",
      "name": "category"
    },
    {
      "id": "uuid",
      "name": "category"
    },
    {
      "id": "uuid",
      "name": "category"
    }
  ]
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```
