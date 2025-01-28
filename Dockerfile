FROM node:22.13.0-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
RUN npm prune --prod

ENV PORT=3333
ENV NODE_ENV=development
ENV DATABASE_URL="postgresql://docker:docker@localhost:5432/upload"
ENV CLOUDFARE_ACCOUNT_ID="#"
ENV CLOUDFARE_ACCESS_KEY_ID="#"
ENV CLOUDFARE_SECRET_ACCESS_KEY="#"
ENV CLOUDFARE_BUCKET="#"
ENV CLOUDFARE_PUBLIC_URL="https://localhost://"

EXPOSE 3333

CMD ["npm", "start"]