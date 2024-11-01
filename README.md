# JSTP

**JSTP** is a simple TypeScript package for generating and managing secure one-time passwords (OTPs) with Redis integration. JSTP provides flexible token generation with customizable formats and a Redis-based storage.

---

## Features

- **Secure token generation** in specified formats and lengths
- **Redis-backed storage** with automatic expiration
- **Customizable token expiration**
- **Automatic token deletion** after verification
- **TypeScript** support

---

## Installation

```
npm install jstp
```

## Prerequisites

- Node.js 14.x or later
- Redis instance

## Configuration
First, configure your Redis client before using the package

```ts
import { createClient } from "redis";

export const getRedisClient = async() => {
  const client = createClient({
    url: process.env.REDIS_URL
  });
  await client.connect();
  return client; 
}
```
## Generating Tokens
Create a JSTP instance and generate tokens:

```ts
import Jstp from "jstp";
import { getRedisClient } from "./redisConfig";

const client = await getRedisClient();
const otpService = new Jstp(client);

const handleOtpGeneration = async () => {
  try {
    const token = await otpService.generateOTP({
      length: 7,
      format: "alphanumeric",
      expiresIn: 3000,
      identifier:"user1234"
    });
    console.log("token =>", token);
  } catch (error) {
    console.error("error =>", error);
  }
};
```

## Verifying Tokens
Verify generated tokens:

```ts
 try {
  const isValid = await otpService.verifyOTP({
    identifier: "user1234",
    token: "ABC123"    // Token to verify
  });

  if (isValid) {
    console.log("Token is valid");
  } else {
    console.log("Token is invalid or expired");
  }
} catch (error) {
  console.error("error =>", error);
}
```

## Configuration Options

| Syntax      | Type                                             | Description                      | Required
| ----------- | -----------                                      | -----------                      | -----------
| length      |  Number                                          | Token length (4-12 characters)   | Yes
| format      | "numeric", "alphabetic", "alphanumeric"          | Token character format           | Yes
| expiresIn   |  number                                          | Token expiration time in seconds | Yes
| identifier  |  string                                          | Unique identifier for the token  | Yes

---

## Token Formats
- numeric: Numbers only (0-9)
- alphabetic: Capital letters only (A-Z)
- alphanumeric: Numbers and capital letters

## License
This package is licensed under the MIT License
