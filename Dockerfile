FROM node:alpine

WORKDIR /app/sgc_project

COPY package.json .

RUN npm install

COPY . .

RUN npm run migrate

EXPOSE 7777

CMD [ "npm", "run", "start" ]