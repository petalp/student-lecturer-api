#base stage
FROM node:25-alpine AS builder

#database url required by prisma generate
ARG DATABASE_URL="postgresql://postgres:toma@db:5432/prisma_1"
#set ci enviroment variable for pnpm
ENV CI=true
ENV DATABASE_URL=${DATABASE_URL}

#install pnpm globally
RUN npm install -g pnpm

#workdir
WORKDIR /app 
COPY package.json pnpm-lock.yaml ./

#production dependencies stage
FROM builder AS prod-deps
RUN pnpm install --prod --no-frozen-lockfile 

#build stage
FROM builder AS build 
RUN pnpm install --no-frozen-lockfile
COPY . . 

RUN pnpm prisma:generate 
RUN pnpm build 

#production stage
FROM node:25-alpine AS production 

#create working directory
WORKDIR /app 

#install pnpm globally
RUN npm install -g pnpm

#copy package files
COPY prisma.config.ts ./ 
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/  

COPY --from=prod-deps /app/node_modules ./node_modules

#copy built application from build stage 
COPY --from=build /app/dist ./dist 
COPY --from=build /app/node_modules/prisma ./node_modules/prisma 
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma



EXPOSE 8080 

CMD ["pnpm", "run", "docker-start"]
