# Lagrange web

**Technology stack：** vue3 + vuex + vue-router + webpack + sass + element-plus
## Docker Deployment
#### Install Docker Compose

https://docs.docker.com/compose/install/
### Stable

Run the following command to run the latest stable image of lagrange-dao-we

```bash
docker build -t lagrangedao/lagrange-dao-web .
docker run  -p 8082:8080 lagrangedao/lagrange-dao-web
```
The service will be Available on:

http://127.0.0.1:8082

http://172.17.0.2:8082

Hit CTRL-C to stop the server

## Build from Source
### Installation dependency

Run `npm install` to generate component.

### Development server

Run `npm run serve` for a dev server. Navigate to `http://localhost:8080/`. The app will automatically reload if you change any of the source files.

## Build project

```shell
# Build test projects
$ npm run build:test

# Build semi prod projects
$ npm run build:prod
```

The build artifacts will be stored in the `dist_test/dist_prod` directory.

## Pre order preparation

**Preparation before operation:**

   Since this project is based on nodejs, you need to make preparations for nodejs. Before running the project, please ensure that the following applications have been installed in the system:

   (1)、Node (Version v14.18.2 of Node was used for this project). Please refer to:[Download and install node.](https://nodejs.org/en/download/)

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
