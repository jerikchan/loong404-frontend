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

ENV OPENAI_API_KEY=

ENV NEXT_PUBLIC_RELEASE_TARGET=development

ENV NEXT_PUBLIC_GREAT_LOONG_IMAGE_CID=QmeUz9d8UiRXofuktKZPiAcR7xzhcWPGBhdSb2cyQa7CE3
ENV NEXT_PUBLIC_BABY_LOONG_IMAGE_CID=QmduvW9pbYhjCo6Qspa3RF6DaqRnkAHqYujfv9fMQmdrCT

# Expose the port the app runs on
EXPOSE 3000

# Set the command to run your app
CMD ["yarn", "start"]
