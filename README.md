# world-cup-scraper

World Cup game data scraper. Scrapes for data in date range starting on 2018-06-14 and ending on 2018-07-15.

## To run
#### Environment Prerequisites
* [Docker](https://www.docker.com/)

#### Instructions
1. Clone this repository: `git clone https://github.com/joshm101/world-cup-scraper.git`
2. Enter directory: `cd ./world-cup-scraper`.
3. Run the command `docker-compose up --build` in the project's root directory. This command will build and start up the Docker container image. 
    * If `npm` is installed on the host machine, you can run `npm run docker-start`
