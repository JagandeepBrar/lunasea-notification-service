FROM node:14.16-alpine
ENV NODE_ENV="docker"
ENV LOG_LEVEL="warn"
# Install packages, copy data, build project
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
# Add Tini
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
# Start the docker version, expose port 9090
CMD ["npm", "run", "docker"]
EXPOSE 9000
