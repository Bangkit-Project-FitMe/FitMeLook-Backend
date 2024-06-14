# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the project
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables
ENV FIREBASE_SERVICE_ACCOUNT_PATH=/usr/src/app/service_account.json
ENV MODEL_URL_SEASONAL='https://storage.googleapis.com/fitmelook-project-bucket/production/models/model-seasonal/model.json'
ENV MODEL_URL_FACE='https://storage.googleapis.com/fitmelook-project-bucket/production/models/model-face/model.json'
ENV MODEL_URL_MTCNN=''

# Start the application
CMD ["node", "dist/main"]
