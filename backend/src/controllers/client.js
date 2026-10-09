import { openDatabase } from "../database.js";
import { deleteVehicle } from "./vehicles.js";

export const listClients = async (request, response) => {
  let db;

  try {
    db = await openDatabase();

    const clients = await db.all(`SELECT * FROM clients`);

    return response.status(200).json(clients);
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    return response.status(500).json({ message: "Erro ao listar clientes!" });
  } finally {
    if (db) await db.close();
  }
};

export const registerClient = async (request, response) => {
  let db;

  try {
    const { name_client, email_client } = request.body;

    if (!name_client || !email_client) {
      return response
        .status(400)
        .json({ message: "Todos os campos são obrigatórios" });
    }

    db = await openDatabase();

    const checkEmailClient = await db.get(
      `SELECT id_client FROM clients WHERE email_client = ?`,
      [email_client],
    );

    if (checkEmailClient) {
      return response.status(409).json({
        message: "Já existe um cliente cadastrado com este email.",
      });
    }
    const data = await db.run(
      `INSERT INTO clients (name_client, email_client)
            VALUES (?, ?)`,
      [name_client, email_client],
    );
    await db.close();

    return response.status(201).json({
      id: data.lastID,
      name_client,
      email_client,
    });
  } catch (error) {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error("Erro ao fechar o banco no catch:", closeError);
      }
    }

    console.error("Erro na rota registerClient:", error);

    return response.status(500).json({
      message: "Não foi possível cadastrar o seu cliente!",
    });
  }
};

export const deleteClient = async (request, response) => {
  let db;
  try {
    db = await openDatabase();

    const { id } = request.params;

    const results = await db.run(`DELETE FROM clients WHERE id_client = ?`, [
      id
    ]);
    const deleteVehicleOwner = await db.run(`DELETE FROM vehicles WHERE owner_vehicle = ?`, [id])

    if (results.changes === 0 && deleteVehicleOwner.changes === 0) {
      return response.status(404).json({ message: "Cliente não encontrado." });
    }

    return response.json({
      message: "Registro de cliente deletado com sucesso!",
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Erro ao deletar registro." });
  } finally {
    if (db) await db.close();
  }
};

export const updateClient = async (request, response) => {
  let db;
  try {
    db = await openDatabase();
    const { id } = request.params;
    const { new_name, new_email } = request.body;

    const client = await db.get(
      `SELECT * FROM client WHERE id_client = ?`,
      [id],
    );

    if (!client) {
      return response.status(404).json({ message: "Cliente não encontrado!" });
    }

    await db.run(
      `UPDATE clients 
       SET name_client = ?, email_client = ? 
       WHERE id_client = ?`,
      [
        new_name ?? client.name_client,
        new_email ?? client.email_client,
        id,
      ],
    );

    return response.json({ message: "Registro de cliente atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Erro ao atualizar cliente." });
  } finally {
    if (db) await db.close();
  }
};
