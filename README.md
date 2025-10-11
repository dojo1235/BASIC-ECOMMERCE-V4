<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


## Authentication

This project implements a production-grade authentication system with the following features:

- **JWT Access + Refresh tokens** with rotation.
- **Hashed refresh tokens** stored per-device in the database.
- **Single-use refresh**: tokens are invalid after use (prevents replay attacks).
- **Per-device logout**: users can log out one session without affecting others.
- **Logout all sessions**: instantly revoke all refresh tokens for a user.
- **Strict validation**: refresh token must match the exact DB record, no loose checks.
- **Short-lived access tokens**: 15m expiry, limiting exposure if stolen.
- **Audit & Revocation**: all refresh tokens tracked with `revokedAt` timestamps.

### Why it matters
This design mirrors what larger teams and managed identity providers (Auth0, Okta) implement:
- Flexible: supports multiple sessions per user.
- Secure: prevents token replay, session reuse, and refresh token leakage.
- Operationally clear: logout and revocation behave predictably across devices.
- 


# Authentication & Session Management Design

## Goals
- Multi-device session support (e.g. phone + laptop).
- Strict security: single-use refresh tokens, per-device revocation, and logout-all.
- Prevent token replay, enforce session lifecycle.

## Model
- **Access Tokens**: short-lived (e.g. 15m), stateless, signed JWT.
- **Refresh Tokens**: long-lived, stored hashed in DB (`scrypt + salt`), one record per device/session.
- **Sessions**: represented by refresh token records in DB (per-user, per-device).

## Flows
### Registration / Login
- Password hashed with `scrypt`.
- On success: issue access + refresh token pair.
- Store refresh token hash in DB (linked to user + device session).

### Refresh
- Verify signature of refresh JWT.
- Lookup DB records for user where `revoked = false`.
- Compare presented token against hashed token (`scrypt + timingSafeEqual`).
- If valid:
  - Mark old token as `revoked`.
  - Issue new access + refresh pair.
  - Store new refresh hash in DB.
- If invalid/missing: reject (`401 Session terminated`).

### Logout (single session)
- Verify refresh token.
- Find exact DB record (strict match).
- Revoke that record only.
- Other sessions remain active.

### Logout All
- Verify refresh token (ensures user identity).
- Revoke **all** refresh tokens for that user.
- Access tokens auto-expire within 15 minutes.

## Security Properties
- **Single-use refresh**: once rotated, old refresh cannot be reused.
- **Per-device revocation**: logout affects only the targeted session.
- **Global revocation**: logout-all removes all sessions instantly.
- **Hashed storage**: refresh tokens never stored raw.
- **Replay protection**: strict token-to-record match required.
- **Grace period**: stolen access tokens expire quickly.

## Operational Notes
- **Secret rotation**: support for rotating JWT secrets periodically (use KMS/env versioning).
- **Monitoring**: log refresh failures and reuse attempts.
- **Tests**: include unit/E2E tests for rotation, reuse detection, single logout, and logout-all.
- **Rate limiting**: apply on login/refresh endpoints to prevent brute force.

---


## ORDERS JSON (PUBLIC)
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": {
    "orders": [
      {
        "id": 3,
        "userId": 26,
        "total": 207.92,
        "contact": "1234567890",
        "shippingAddress": "No.2 Fake street Not real",
        "shippingFee": 0,
        "status": "pending",
        "orderItems": [
          {
            "id": 7,
            "orderId": 3,
            "productId": 1,
            "quantity": 8,
            "price": 25.99,
            "product": {
              "id": 1,
              "name": "Wireless Mouse",
              "image": "https://source.unsplash.com/400x400/?mouse",
              "price": 25.99
            }
          }
        ]
      },
      {
        "id": 2,
        "userId": 26,
        "total": 1919.8,
        "contact": "1234567890",
        "shippingAddress": "No.2 Fake street Not real",
        "shippingFee": 0,
        "status": "cancelled",
        "orderItems": [
          {
            "id": 4,
            "orderId": 2,
            "productId": 1,
            "quantity": 5,
            "price": 25.99,
            "product": {
              "id": 1,
              "name": "Wireless Mouse",
              "image": "https://source.unsplash.com/400x400/?mouse",
              "price": 25.99
            }
          },
          {
            "id": 5,
            "orderId": 2,
            "productId": 2,
            "quantity": 10,
            "price": 89,
            "product": {
              "id": 2,
              "name": "Mechanical Keyboard",
              "image": "https://source.unsplash.com/400x400/?keyboard",
              "price": 89
            }
          },
          {
            "id": 6,
            "orderId": 2,
            "productId": 3,
            "quantity": 15,
            "price": 59.99,
            "product": {
              "id": 3,
              "name": "Bluetooth Speaker",
              "image": "https://source.unsplash.com/400x400/?speaker",
              "price": 59.99
            }
          }
        ]
      },
      {
        "id": 1,
        "userId": 26,
        "total": 886.84,
        "contact": "09047701355",
        "shippingAddress": "No. 18 Iwo-Ama Bille Kingdom",
        "shippingFee": 0,
        "status": "cancelled",
        "orderItems": [
          {
            "id": 1,
            "orderId": 1,
            "productId": 1,
            "quantity": 10,
            "price": 25.99,
            "product": {
              "id": 1,
              "name": "Wireless Mouse",
              "image": "https://source.unsplash.com/400x400/?mouse",
              "price": 25.99
            }
          },
          {
            "id": 2,
            "orderId": 1,
            "productId": 2,
            "quantity": 3,
            "price": 89,
            "product": {
              "id": 2,
              "name": "Mechanical Keyboard",
              "image": "https://source.unsplash.com/400x400/?keyboard",
              "price": 89
            }
          },
          {
            "id": 3,
            "orderId": 1,
            "productId": 3,
            "quantity": 6,
            "price": 59.99,
            "product": {
              "id": 3,
              "name": "Bluetooth Speaker",
              "image": "https://source.unsplash.com/400x400/?speaker",
              "price": 59.99
            }
          }
        ]
      }
    ],
    "meta": {
      "pagination": {
        "page": 1,
        "limit": 10,
        "count": 3,
        "total": 3,
        "totalPages": 1
      }
    }
  }
}


## ORDERS JSON (NORMAL ADMINS)
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": {
    "orders": [
      {
        "id": 3,
        "userId": 26,
        "total": 207.92,
        "contact": "1234567890",
        "shippingAddress": "No.2 Fake street Not real",
        "shippingFee": 0,
        "status": "pending",
        "isDeleted": false,
        "createdAt": "2025-10-10T11:14:17.129Z",
        "updatedAt": null,
        "deletedAt": null,
        "restoredAt": null,
        "orderItems": [
          {
            "id": 7,
            "orderId": 3,
            "productId": 1,
            "quantity": 8,
            "price": 25.99,
            "product": {
              "id": 1,
              "name": "Wireless Mouse",
              "image": "https://source.unsplash.com/400x400/?mouse",
              "price": 25.99
            }
          }
        ]
      },
      {
        "id": 2,
        "userId": 26,
        "total": 1919.8,
        "contact": "1234567890",
        "shippingAddress": "No.2 Fake street Not real",
        "shippingFee": 0,
        "status": "cancelled",
        "isDeleted": false,
        "createdAt": "2025-10-09T20:49:41.360Z",
        "updatedAt": "2025-10-09T21:01:01.678Z",
        "deletedAt": null,
        "restoredAt": null,
        "orderItems": [
          {
            "id": 4,
            "orderId": 2,
            "productId": 1,
            "quantity": 5,
            "price": 25.99,
            "product": {
              "id": 1,
              "name": "Wireless Mouse",
              "image": "https://source.unsplash.com/400x400/?mouse",
              "price": 25.99
            }
          },
          {
            "id": 5,
            "orderId": 2,
            "productId": 2,
            "quantity": 10,
            "price": 89,
            "product": {
              "id": 2,
              "name": "Mechanical Keyboard",
              "image": "https://source.unsplash.com/400x400/?keyboard",
              "price": 89
            }
          },
          {
            "id": 6,
            "orderId": 2,
            "productId": 3,
            "quantity": 15,
            "price": 59.99,
            "product": {
              "id": 3,
              "name": "Bluetooth Speaker",
              "image": "https://source.unsplash.com/400x400/?speaker",
              "price": 59.99
            }
          }
        ]
      },
      {
        "id": 1,
        "userId": 26,
        "total": 886.84,
        "contact": "09047701355",
        "shippingAddress": "No. 18 Iwo-Ama Bille Kingdom",
        "shippingFee": 0,
        "status": "cancelled",
        "isDeleted": false,
        "createdAt": "2025-10-09T18:35:27.011Z",
        "updatedAt": null,
        "deletedAt": "2025-10-09T20:38:51.533Z",
        "restoredAt": "2025-10-09T20:39:03.117Z",
        "orderItems": [
          {
            "id": 1,
            "orderId": 1,
            "productId": 1,
            "quantity": 10,
            "price": 25.99,
            "product": {
              "id": 1,
              "name": "Wireless Mouse",
              "image": "https://source.unsplash.com/400x400/?mouse",
              "price": 25.99
            }
          },
          {
            "id": 2,
            "orderId": 1,
            "productId": 2,
            "quantity": 3,
            "price": 89,
            "product": {
              "id": 2,
              "name": "Mechanical Keyboard",
              "image": "https://source.unsplash.com/400x400/?keyboard",
              "price": 89
            }
          },
          {
            "id": 3,
            "orderId": 1,
            "productId": 3,
            "quantity": 6,
            "price": 59.99,
            "product": {
              "id": 3,
              "name": "Bluetooth Speaker",
              "image": "https://source.unsplash.com/400x400/?speaker",
              "price": 59.99
            }
          }
        ]
      }
    ],
    "meta": {
      "pagination": {
        "page": 1,
        "limit": 10,
        "count": 3,
        "total": 3,
        "totalPages": 1
      }
    }
  }
}


## ORDERS JSON (SUPER ADMIN)
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": {
    "orders": [
      {
        "id": 3,
        "userId": 26,
        "total": 207.92,
        "contact": "1234567890",
        "shippingAddress": "No.2 Fake street Not real",
        "shippingFee": 0,
        "status": "pending",
        "isDeleted": false,
        "createdAt": "2025-10-10T11:14:17.129Z",
        "updatedBy": null,
        "updatedAt": null,
        "deletedBy": null,
        "deletedAt": null,
        "restoredBy": null,
        "restoredAt": null,
        "orderItems": [
          {
            "id": 7,
            "orderId": 3,
            "productId": 1,
            "quantity": 8,
            "price": 25.99,
            "product": {
              "id": 1,
              "name": "Wireless Mouse",
              "image": "https://source.unsplash.com/400x400/?mouse",
              "price": 25.99
            }
          }
        ]
      },
      {
        "id": 2,
        "userId": 26,
        "total": 1919.8,
        "contact": "1234567890",
        "shippingAddress": "No.2 Fake street Not real",
        "shippingFee": 0,
        "status": "cancelled",
        "isDeleted": false,
        "createdAt": "2025-10-09T20:49:41.360Z",
        "updatedBy": 1,
        "updatedAt": "2025-10-09T21:01:01.678Z",
        "deletedBy": null,
        "deletedAt": null,
        "restoredBy": null,
        "restoredAt": null,
        "orderItems": [
          {
            "id": 4,
            "orderId": 2,
            "productId": 1,
            "quantity": 5,
            "price": 25.99,
            "product": {
              "id": 1,
              "name": "Wireless Mouse",
              "image": "https://source.unsplash.com/400x400/?mouse",
              "price": 25.99
            }
          },
          {
            "id": 5,
            "orderId": 2,
            "productId": 2,
            "quantity": 10,
            "price": 89,
            "product": {
              "id": 2,
              "name": "Mechanical Keyboard",
              "image": "https://source.unsplash.com/400x400/?keyboard",
              "price": 89
            }
          },
          {
            "id": 6,
            "orderId": 2,
            "productId": 3,
            "quantity": 15,
            "price": 59.99,
            "product": {
              "id": 3,
              "name": "Bluetooth Speaker",
              "image": "https://source.unsplash.com/400x400/?speaker",
              "price": 59.99
            }
          }
        ]
      },
      {
        "id": 1,
        "userId": 26,
        "total": 886.84,
        "contact": "09047701355",
        "shippingAddress": "No. 18 Iwo-Ama Bille Kingdom",
        "shippingFee": 0,
        "status": "cancelled",
        "isDeleted": false,
        "createdAt": "2025-10-09T18:35:27.011Z",
        "updatedBy": null,
        "updatedAt": null,
        "deletedBy": 1,
        "deletedAt": "2025-10-09T20:38:51.533Z",
        "restoredBy": 1,
        "restoredAt": "2025-10-09T20:39:03.117Z",
        "orderItems": [
          {
            "id": 1,
            "orderId": 1,
            "productId": 1,
            "quantity": 10,
            "price": 25.99,
            "product": {
              "id": 1,
              "name": "Wireless Mouse",
              "image": "https://source.unsplash.com/400x400/?mouse",
              "price": 25.99
            }
          },
          {
            "id": 2,
            "orderId": 1,
            "productId": 2,
            "quantity": 3,
            "price": 89,
            "product": {
              "id": 2,
              "name": "Mechanical Keyboard",
              "image": "https://source.unsplash.com/400x400/?keyboard",
              "price": 89
            }
          },
          {
            "id": 3,
            "orderId": 1,
            "productId": 3,
            "quantity": 6,
            "price": 59.99,
            "product": {
              "id": 3,
              "name": "Bluetooth Speaker",
              "image": "https://source.unsplash.com/400x400/?speaker",
              "price": 59.99
            }
          }
        ]
      }
    ],
    "meta": {
      "pagination": {
        "page": 1,
        "limit": 10,
        "count": 3,
        "total": 3,
        "totalPages": 1
      }
    }
  }
}



## DEVELOPED BY
BRIGGS DIVINE TOBIN