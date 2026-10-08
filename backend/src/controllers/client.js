import { openDatabase } from "../database.js";

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
