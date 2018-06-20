docker kill match-scraper-container
docker rm match-scraper-container
docker build -t match-scraper --build-arg WCS_MONGODB_CONNECTION_URI=${WCS_MONGODB_CONNECTION_URI} --build-arg WCS_MONGODB_CONNECTION_USERNAME=${WCS_MONGODB_CONNECTION_USERNAME} --build-arg WCS_MONGODB_CONNECTION_PASSWORD=${WCS_MONGODB_CONNECTION_PASSWORD} .
docker run -d --name match-scraper-container match-scraper
docker logs -f match-scraper-container