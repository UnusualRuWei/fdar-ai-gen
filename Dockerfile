FROM node:lts-alpine
ENV NODE_ENV=development
WORKDIR /react-app/fdar-ai-gen
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN apk add git
RUN npm install
COPY . .
EXPOSE 5173
RUN chown -R node /react-app/fdar-ai-gen
USER node
CMD ["npm", "run", "dev", "--", "--host"]