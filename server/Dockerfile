FROM node as builder
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "run", "start:prod"]