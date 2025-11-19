# Review Service API

A microservice for managing product reviews and ratings, following the same architecture pattern as ProductApp-API.

## Overview

This service provides REST API endpoints for:
- Creating product reviews
- Updating reviews
- Retrieving reviews by product ID
- Calculating average ratings
- Managing review data

## Technology Stack

- **Spring Boot 3.1.4**
- **Java 17**
- **MySQL** (via JPA/Hibernate)
- **Maven**
- **Lombok**

## API Endpoints

### Base URL: `/api/reviews`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews` | Get all reviews |
| GET | `/api/reviews/{id}` | Get review by ID |
| GET | `/api/reviews/product/{productId}` | Get all reviews for a product |
| GET | `/api/reviews/product/{productId}/average-rating` | Get average rating for a product |
| POST | `/api/reviews` | Create a new review |
| PUT | `/api/reviews/{id}` | Update a review |
| DELETE | `/api/reviews/{id}` | Delete a review |

## Review Model

```java
{
  "id": Long,
  "productId": Long,
  "reviewerName": String,
  "rating": Integer (1-5),
  "comment": String,
  "reviewDate": LocalDateTime
}
```

## Configuration

### Application Properties
- Database connection via environment variables:
  - `SPRING_DATASOURCE_URL`
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`

### Port
- **8082** (different from Product Service which uses 8080)

## Database

- Uses MySQL database named `review`
- Connection string: `jdbc:mysql://mysql-chart:3306/review`
- JPA auto-creates schema on startup (`ddl-auto=create-drop`)

## Docker

Build and run:
```bash
docker build -t sohampa/review-api:latest .
docker run -p 8082:8082 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql-chart:3306/review \
  -e SPRING_DATASOURCE_USERNAME=admin \
  -e SPRING_DATASOURCE_PASSWORD=admin \
  sohampa/review-api:latest
```

## Kubernetes Deployment

### Helm Chart
Located in `charts/review-api-chart/`

### Service Name
- Kubernetes service name: `review-service`
- Port: `8082`
- Type: `ClusterIP`

### Deployment
```bash
cd charts/review-api-chart
helm install review-api . -f values.yaml
```

## Integration with Product Service

This service is designed to work alongside the Product Service:
- Reviews reference products by `productId`
- No direct database coupling - uses product IDs only
- Can be deployed independently

## Example API Calls

### Create a Review
```bash
curl -X POST http://localhost:8082/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "reviewerName": "John Doe",
    "rating": 5,
    "comment": "Great product!"
  }'
```

### Get Reviews for Product
```bash
curl http://localhost:8082/api/reviews/product/1
```

### Get Average Rating
```bash
curl http://localhost:8082/api/reviews/product/1/average-rating
```

## Architecture

```
ReviewApp-API (Port 8082)
    ↓
MySQL Database (review schema)
    ↓
Kubernetes Service: review-service
```

## Notes

- CORS enabled for all origins (same as Product Service)
- No authentication required (matches current architecture)
- Follows same patterns as ProductApp-API for consistency


