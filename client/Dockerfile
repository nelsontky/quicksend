FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ENV NEXT_PUBLIC_HCAPTCHA_SITE_KEY=096e004b-97fa-4a73-8271-c509eb06ecc2

RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start" ]
