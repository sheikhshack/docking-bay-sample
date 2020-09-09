FROM node:14-alpine
COPY . /app

WORKDIR /app
RUN  npm install

ENV SECRET=secret
ENV TEST_MONGODB_URI=nullified
ENV MONGODB_URI=nullified

EXPOSE 3000
CMD ["npm", "start"]
