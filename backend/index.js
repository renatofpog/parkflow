import "dotenv/config";
import express from "express";

import {
  listVehicles,
  registerVehicles,
  deleteVehicle,
  updateVehicle,
} from "./src/controllers/vehicles.js";

import {
  listClients,
  registerClient,
  deleteClient,
  updateClient,
} from "./src/controllers/client.js";

import {
  listUsers,
  createUser,
  deleteUser,
  updateUser,
  loginUser,
} from "./src/controllers/users.js";

import {
  listParks,
  registerPark,
  deletePark,
  updatePark,
} from "./src/controllers/park.js";

import { authMiddleware } from "./src/middlewares/auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Middleware
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

/* ROTA DE LOGIN (PÚBLICA) */
app.post("/login", loginUser);
app.post("/users", createUser);

app.use(authMiddleware);

/* ROTAS VEÍCULOS */
app.get("/vehicles", listVehicles);
app.post("/vehicles", registerVehicles);
app.delete("/vehicles/:id", deleteVehicle);
app.put("/vehicles/:id", updateVehicle);

/* ROTAS CLIENTES */
app.get("/clients", listClients);
app.post("/clients", registerClient);
app.delete("/clients/:id", deleteClient);
app.put("/clients/:id", updateClient);

/* ROTAS ESTACIONAMENTO */
app.get("/parks", listParks);
app.post("/parks", registerPark);
app.delete("/parks/:id", deletePark);
app.put("/parks/:id", updatePark);

/* ROTAS USUARIOS */
app.get("/users", listUsers);
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
