FROM node:alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN cd client && npm install && npm run build

EXPOSE 3001

CMD ["npm","start"]
