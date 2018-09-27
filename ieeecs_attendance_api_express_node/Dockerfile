FROM node:8
WORKDIR /srv/app
RUN mkdir /srv/site
RUN chown -R node:node /srv/
USER node
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
