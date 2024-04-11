#!/bin/bash
rm -rf .next/
NEXT_PUBLIC_RELEASE_TARGET=production NEXT_PUBLIC_GREAT_LOONG_IMAGE_CID=QmeUz9d8UiRXofuktKZPiAcR7xzhcWPGBhdSb2cyQa7CE3 NEXT_PUBLIC_BABY_LOONG_IMAGE_CID=QmduvW9pbYhjCo6Qspa3RF6DaqRnkAHqYujfv9fMQmdrCT npm run build
docker build -t hamstershare/loong-frontend:$1 .
docker push hamstershare/loong-frontend:$1
