# Stage 1
FROM node:18-alpine
WORKDIR /app

# Copy the build output and other necessary files from the builder stage
COPY ./next.config.js ./
COPY ./.next ./.next
COPY ./node_modules ./node_modules
COPY ./package.json ./package.json

ENV MYSQL_HOST=
ENV MYSQL_USER=loong
ENV MYSQL_PASSWORD=
ENV MYSQL_DATABASE=loong
ENV MYSQL_PORT=30303

ENV NEXT_PUBLIC_RELEASE_TARGET=development


# Expose the port the app runs on
EXPOSE 3000

# Set the command to run your app
CMD ["yarn", "start"]
