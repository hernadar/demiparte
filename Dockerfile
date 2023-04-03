FROM node:18.15-alpine3.16

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN cd client && npm run build

EXPOSE 3001

CMD ["npm","start"]
