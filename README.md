# world-cup-scraper

World Cup game data scraper. Scrapes for data in date range starting on 2018-06-14 and ending on 2018-07-15.

## To run
#### Environment Prerequisites
* [Docker](https://www.docker.com/)

#### Instructions
1. Clone this repository: `git clone https://github.com/joshm101/world-cup-scraper.git`
2. Enter directory: `cd ./world-cup-scraper`.
3. Initialize database:
    * Invoke the `run-init-db` shell script located at the repository root: `./run-init-db.sh`
4. Get & save group stage match data:
    * Invoke the `run` shell script located at the repository root: `./run.sh`
