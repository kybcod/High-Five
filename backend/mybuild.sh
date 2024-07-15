# react project build
cd ../frontend
npm run build

# index.html, main.js 복사(이동) : dist -> static
cd ../backend
rm -rf src/main/resources/static
mv ../frontend/dist src/main/resources/static

# spring project build
./gradlew bootJar

# build image
docker build -t ybk0215/function .

# push image
docker push ybk0215/function

# remote 에서

# 컨테이너 멈추고
ssh -i src/main/resources/secret/key0527.pem ubuntu@3.39.193.68 'docker stop function'
# 컨테이너 삭제
ssh -i src/main/resources/secret/key0527.pem ubuntu@3.39.193.68 'docker rm function'
# pull image
ssh -i src/main/resources/secret/key0527.pem ubuntu@3.39.193.68 'docker pull ybk0215/function'
# 컨테이너 실행
ssh -i src/main/resources/secret/key0527.pem ubuntu@3.39.193.68 'docker run -d -p 8080:8080 --restart always --name function ybk0215/function'
# 필요없는 이미지 삭제
ssh -i src/main/resources/secret/key0527.pem ubuntu@3.39.193.68 'docker image prune -f'