FROM mhart/alpine-node:8

# Create app directory
WORKDIR ./app

# Install dependencies
# A wildcard is used to ensure both package.json AND package-lock.json
# are copied where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

ARG WCS_MONGODB_CONNECTION_URI
ARG WCS_MONGODB_CONNECTION_USERNAME
ARG WCS_MONGODB_CONNECTION_PASSWORD
ARG INIT_DB

ENV WCS_MONGODB_CONNECTION_URI=$WCS_MONGODB_CONNECTION_URI
ENV WCS_MONGODB_CONNECTION_USERNAME=$WCS_MONGODB_CONNECTION_USERNAME
ENV WCS_MONGODB_CONNECTION_PASSWORD=$WCS_MONGODB_CONNECTION_PASSWORD
ENV INIT_DB=$INIT_DB

CMD ["npm", "start"]