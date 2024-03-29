# Create instructions used by the Docker Engine to create a Docker Image

############################################################################################

#STAGE 1: Install all dependencies in package.json

# Specifies the base image to use
# Use node version 16.15.0
FROM node:16.15.0@sha256:59eb4e9d6a344ae1161e7d6d8af831cb50713cc631889a5a8c2d438d6ec6aa0f AS dependencies

# Define metadata
LABEL maintainer="Le Minh Nhat Dang <lmndang@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Define environment variables
# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package.json package-lock.json ./

# Install node dependencies defined in package-lock.json
RUN npm ci

############################################################################################

#STAGE 2: Use dependencies to build fragments
FROM node:16.15.0@sha256:59eb4e9d6a344ae1161e7d6d8af831cb50713cc631889a5a8c2d438d6ec6aa0f AS builder

# Use /app as our working directory (same as Stage 1)
WORKDIR /app

#Copy node_modules, package.json, and package-lock.json from stage 1 to the /app folder
COPY --from=dependencies /app /app

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file (Basic Auth Testing)
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD ["node", "src/index.js"]

# We run our service on port 8080
EXPOSE 8080
