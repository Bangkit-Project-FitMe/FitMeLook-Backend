# Backend FitMeLook

## Overview

This backend project is built with cutting-edge technologies to provide seamless and efficient services. This project leverages the power of NestJS, Node.js, Firebase and Cloud Firestore to create a robust and scalable backend solution for FitMeLook product app.

## Technology Stack

- **NestJS (Express)**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Javascript (Node.js) & Typescript**: The core programming languages used for building the application.
- **Firebase & Cloud Firestore**: For data storage and real-time database functionalities.

## Installed Packages

- `@nestjs/common`
- `@nestjs/config`
- `@nestjs/core`
- `@nestjs/platform-express`
- `@tensorflow/tfjs-node`
- `firebase-admin`
- `reflect-metadata`
- `rxjs`

## Prerequisites

Before running the project, ensure you have the following:

1. **Seasonal Model**: A machine learning model for seasonal analysis.
2. **Face Shape Model**: A machine learning model for face shape analysis.
3. **MTCNN Model**: A machine learning model for Multi-task Cascaded Convolutional Networks.
4. **Google Cloud Service Account Key**: Required for Firebase and Cloud Firestore integration.


<hr>

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/Bangkit-Project-FitMe/backend-cc.git
```

### Step 2: Navigate to the Project Directory

```bash
cd backend-cc
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment Variable

```bash
cat > .env << EOF
FIREBASE_SERVICE_ACCOUNT_PATH=<YOUR_FIREBASE_SERVICE_ACCOUNT_PATH>
MODEL_URL_SEASONAL=<YOUR_MODEL_URL>
MODEL_URL_FACE=<YOUR_MODEL_URL>
MODEL_URL_MTCNN=<YOUR_MODEL_URL>
EOF
```

### Step 5: Run this project

```bash
npm run start
```

## [API Documentation]

For detailed API Documentation, please visit the [API_Documentation](API_Documentation.md) file.
