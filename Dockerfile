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

CMD ["npm", "start"]