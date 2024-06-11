# Backend FitMeLook

## Technology Used :

- NestJS (Express)
- Javascript (Node.js) & Typescript
- Firebase & Cloud Firestore

## Installed Packages

- @nestjs/common
- @nestjs/config
- @nestjs/core
- @nestjs/platform-express
- @tensorflow/tfjs-node
- firebase-admin
- reflect-metadata
- rxjs

## How To Run / Install On Your Local Machine

Requirements:

1. Seasonal Model
2. Face Shape Model
3. MTCNN Model
4. Google Cloud Service Account Key

<hr>

Clone this repository

```bash
git clone https://github.com/Bangkit-Project-FitMe/backend-cc.git
```

Open this project directory

```bash
cd backend-cc
```

Install dependencies

```bash
npm install
```

Add .env to the directory

```bash
cat > .env << EOF
FIREBASE_SERVICE_ACCOUNT_PATH=<YOUR_FIREBASE_SERVICE_ACCOUNT_PATH>
MODEL_URL_SEASONAL=<YOUR_MODEL_URL>
MODEL_URL_FACE=<YOUR_MODEL_URL>
MODEL_URL_MTCNN=<YOUR_MODEL_URL>
EOF
```

Run this project

```bash
npm run start
```

## [API Documentation](api-docs.md)