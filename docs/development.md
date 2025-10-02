# Development setup

This file provides guiding to setup development environment.

## Getting started

1. Install dependencies

    - [Node](https://nodejs.org/en/download)
    - [Docker](https://docs.docker.com/engine/install/)

1. Setup environment variables

    The application uses OpenWeather API. You need to have the API key. In
    addition you need to setup a port for the backend.

    ```env
    PORT=3001
    OPEN_WEATHER_API_KEY=<your-api-key>

1. Setup development environment

    Use following command to install required packages, setup Husky and build
    Docker images.

    ```bash
    npm run dev:setup
    ```

    This runs a script located at `./scripts/dev_setup.sh`.

    > [!NOTE]
    > Husky is used to setup pre-commit hook that lints the staged files.

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
