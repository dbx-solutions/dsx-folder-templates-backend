FROM node:18.4-alpine3.15

RUN npm install pm2 -g

WORKDIR  /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
