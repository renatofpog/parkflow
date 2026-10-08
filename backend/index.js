import express from "express";
import {
  listVehicles,
  registerVehicles,
  deleteVehicle,
  updateVehicle,
} from "./src/controllers/vehicles.js";
import { listClients, registerClient } from "./src/controllers/client.js";

const app = express();

const PORT = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

  res.header(
    "Access-Control-Allow-Headers",
    "X-PINGOTHER, Content-Type, Authorization",
  );

  next();
});

app.use(express.json());

/* ROTAS VEÍCULOS */
app.get("/vehicles", listVehicles);
app.post("/vehicles", registerVehicles);
app.delete("/vehicles/:id", deleteVehicle);
app.put("/vehicles/:id", updateVehicle);

/* ROTAS CLIENTES */
app.get("/clients", listClients);
app.post("/clients", registerClient);


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
