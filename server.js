const express = require("express");
const fs = require("fs");
const http = require("http");
const WebSocket = require("ws");

// ========== Imports ==========
const Diario = require("./app/models/Diario");
const Notificador = require("./app/utils/Notificador");
const AulaController = require("./app/controllers/AulaController");
const PresencaController = require("./app/controllers/PresencaController");
const configurarRotas = require("./app/routes/routes");

// ===== setup =====
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;

// ===== midleware =====
app.use(express.json());
app.use(express.static("public"));

// ===== Iniciar componentes =====
const diario = new Diario("diario.json");
const notificador = new Notificador(wss);
const aulaController = new AulaController(diario, notificador);
const presencaController = new PresencaController(diario, notificador);

let longPollingClients = [];

// ===== Websocket =====
wss.on("connection", ws => {
    console.log("Cliente conectado");

    ws.on("close", () => {
        console.log("Cliente desconectado");
    });

    ws.on("error", err => {
        console.log("Erro no WebSocket:", err.message);
    });

    ws.send(JSON.stringify(diario));
});

// ===== Configurar rotas =====
const rotas = configurarRotas(app, aulaController, presencaController, notificador);
app.use(rotas);

// ===== Iniciar o servidor =====
server.listen(PORT, () =>
    console.log(`Servidor rodando na porta ${PORT}`)
);