This repository contains a single web application (`./web`) and a Docker Compose setup that runs the web server on port **3000**. Follow the instructions below to get the project up and running.

---

## Prerequisites

* **Docker** (version 20.10 or higher)
* **Docker Compose** (v2+ or the standalone `docker-compose` plugin)

Make sure both are installed and running on your machine. You can verify with:

```bash
docker --version
docker compose version   # or `docker-compose --version`
```

---

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Arserebryakova/Bite4Delight_Front.git
   cd /<path>/<to>/Bite4Delight_Front
   ```

2. **Build and start the containers**
   From the repository root (where `docker-compose.yaml` resides), run:

   ```bash
   docker compose up --build
   ```

   or, if you use the standalone binary:

   ```bash
   docker-compose up --build
   ```

   The first time you run this, Docker will build the web image from `./web/Dockerfile`, then start the container.

3. **Access the application**
   Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

   The React web app will be served there.

4. **Stopping the containers**
   In the same directory, press `Ctrl+C` to stop, then remove containers and networks:

   ```bash
   docker compose down
   ```

   or

   ```bash
   docker-compose down
   ```

---

## Project Structure

```
├── docker-compose.yaml     # Orchestrates the web container
└── web/
    ├── Dockerfile          # Builds the React application
    ├── package.json        # Frontend dependencies and scripts
    ├── public/             # Static assets (index.html, icons)
    └── src/                # React source code
        ├── index.js
        ├── App.jsx
        └── components/
```

---

## Development

If you want to work on the frontend locally without Docker:

1. **Install dependencies**

   ```bash
   cd web
   npm install
   ```

2. **Run in development mode**

   ```bash
   npm start
   ```

   The app will launch at `http://localhost:3000` with hot reloading.

---

## Customization

* **Port**: Change the exposed port in `docker-compose.yaml` under the `ports` section if you need to use a different port.
* **Environment Variables**: You can add an `.env` file and reference variables in your Dockerfile or Compose file as needed.

---

## License

This project is open-source and available under the [MIT License](LICENSE).


