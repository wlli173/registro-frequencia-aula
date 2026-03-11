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
    console.log("Clientes WebSocket:", this.wss.clients.size);
    console.log("Clientes Long Polling:", this.longPollingClients.length);

    this.wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        console.log("Enviando atualização via WebSocket");
        client.send(JSON.stringify(diario));
      }
    });

    this.longPollingClients.forEach((res) => {
      try {
        res.json(diario);
      } catch (e) {}
    });

    this.longPollingClients = [];
  }
}

module.exports = Notificador;