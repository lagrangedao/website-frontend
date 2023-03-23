FROM node:15-alpine as builder
# python2 support

RUN apk add --update \
  python3 \
  python3-dev \
  py-pip \
  build-base \
  git \
  openssh-client \
&& pip install virtualenv \
&& rm -rf /var/cache/apk/* \

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build:prod

FROM nginx:1.15.2-alpine as production-build


## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder dist_prod /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]