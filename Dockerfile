# --- Stage 1: Build the application ---
FROM node:24-slim AS builder

WORKDIR /usr/app/release-manager-app

COPY package.json package-lock.json ./
COPY tsconfig.json ./
RUN npm install
RUN npm cache verify

COPY src ./src
RUN npm run build
# this should produce the build folder

# --- Stage 2: Run the application ---
FROM node:24-slim AS runner
ENV NODE_ENV="production"

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0
WORKDIR /usr/app/release-manager-app

COPY package.json package-lock.json ./
COPY tsconfig.json ./
RUN npm ci --production

COPY --from=builder /usr/app/release-manager-app/build ./build
COPY app.yml ./

CMD [ "npm", "start" ]
