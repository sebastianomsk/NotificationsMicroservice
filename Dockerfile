FROM keymetrics/pm2:12-alpine

# Install app dependencies
RUN apk add --no-cache git
ENV NPM_CONFIG_LOGLEVEL warn
COPY package*.json ./
RUN npm ci --production

# Bundle APP files
COPY . .

# Expose the listening port of your app
EXPOSE $PORT

# start the application
CMD [ "pm2-runtime", "start", "index.js" ]
