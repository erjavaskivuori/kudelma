# Development setup

This file provides guiding to setup development environment with Docker.

## Getting started

1. Install dependencies

    - [Node](https://nodejs.org/en/download)
    - [Docker](https://docs.docker.com/engine/install/)

1. Setup environment variables

    The application uses OpenWeather API, Google Gemini API and Spoonacular API,
    which require an API key. In addition you need to setup a port for the
    backend, and database URL.

    The prompt for Gemini is also defined as an environment variable. Gemini is
    used to create keywords to fetch data from 3rd party APIs.

    ```env
    PORT=3001
    OPEN_WEATHER_API_KEY=<your-api-key>
    GEMINI_API_KEY=<your-api-key>
    SPOONACULAR_API_KEY=<your-api-key>
    DATABASE_URL="postgresql://postgres:prisma@postgres:5432/postgres"

    GENAI_PROMPT=""
    ```

    >INFO: `postgres:5432` works only with Docker. If running locally, use
    `localhost:5432`.

1. Setup development environment

    Use following command to install required packages, setup Husky and build
    Docker images. Husky is used to setup pre-commit hook that lints the staged
    files.

    ```bash
    npm run dev:setup
    ```

    This runs a script located at `./scripts/dev_setup.sh`.

1. Start and stop the project

    Use the following command to start the services in the development
    environment.

    ```bash
    npm run dev:start
    ```

    This command runs the script located at `./script/dev_start.sh`. It starts
    the services defined in `docker-compose.dev.yaml`.

    To stop the containers you can use `CTRL + C`.

    To remove containers run:

    ```bash
    docker compose -f docker-compose.dev.yaml down -v
    ```

## Using Prisma

First run the following command to create Prisma Client.

```bash
docker compose exec server npx prisma generate
```

To run migrations inside server container use the following command.

```bash
docker compose exec server npx prisma migrate dev --name <name-of-the-migration>
```

Prisma studio is also started when running the development setup. Prisma studio
is a tool that can be used to visualize and add records to the database. It can
be accessed at [http://localhost:5555](http://localhost:5555).
