docker kill init-db-container
docker rm init-db-container
docker build -t init-db --build-arg WCS_MONGODB_CONNECTION_URI=${WCS_MONGODB_CONNECTION_URI} --build-arg WCS_MONGODB_CONNECTION_USERNAME=${WCS_MONGODB_CONNECTION_USERNAME} --build-arg WCS_MONGODB_CONNECTION_PASSWORD=${WCS_MONGODB_CONNECTION_PASSWORD} --build-arg INIT_DB=true .
docker run --name init-db-container init-db
docker logs -f init-db-container
