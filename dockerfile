# . Base image (Node.js)
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# . Expose the port that the app runs on
EXPOSE 3000

# . Start the app
CMD ["npm", "start"]
