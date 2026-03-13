FROM node:alpine 

WORKDIR /app  

COPY package*.json ./ 

COPY tsconfig.json ./

RUN npm install -g pnpm 

RUN pnpm install 

RUN pnpm up latest

COPY . . 

RUN pnpm prisma:generate 

RUN pnpm build 

EXPOSE 8080 

CMD ["pnpm", "run", "dev"]
