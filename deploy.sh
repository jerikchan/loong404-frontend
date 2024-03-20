#!/bin/bash
rm -rf .next/
NEXT_PUBLIC_RELEASE_TARGET=production npm run build
docker build -t hamstershare/loong-frontend:$1 .
docker push hamstershare/loong-frontend:$1
