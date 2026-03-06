class Notificador {
  constructor(wss) {
    this.wss = wss;
    this.longPollingClients = [];
  }

  adicionarClienteLongPolling(res) {
    this.longPollingClients.push(res);
  }

  removerClienteLongPolling(res) {
    this.longPollingClients = this.longPollingClients.filter((r) => r !== res);
  }

  notificar(diario) {
    console.log("Notificando clientes...");
    console.log("Clientes WebSocket:", wss.clients.size);
    console.log("Clientes Long Polling:", longPollingClients.length);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log("Enviando atualização via WebSocket");
        client.send(JSON.stringify(diario));
      }
    });

    longPollingClients.forEach((res) => {
      try {
        res.json(diario);
      } catch (e) {}
    });

    longPollingClients = [];
  }
}

module.exports = Notificador;
