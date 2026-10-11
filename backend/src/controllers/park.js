import { openDatabase } from "../database.js";

export const listParks = async (request, response) => {
  let db;
  try {
    db = await openDatabase();

    const results = await db.all(`SELECT * FROM parks`);

    return response.status(200).json(results);
  } catch (error) {
    console.error("Erro ao listar os estacionamentos criados!", error);
  }
};

export const registerPark = async (request, response) => {
  let db;
  try {
    const { park_name, park_owner } = request.body;

    if (!park_name || !park_owner) {
      return response.status(400).json({
        message: "Todos os campos são obrigatórios.",
      });
    }

    db = await openDatabase();

    const data = await db.run(
      `
        INSERT INTO parks (park_name, park_owner)
        VALUES (?, ?)`,
      [park_name, park_owner],
    );
    await db.close();

    return response.status(201).json({
      id: data.lastID,
      park_name,
      park_owner,
    });
  } catch (error) {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error("Erro ao fechar o banco no catch:", closeError);
      }
    }

    console.error("Erro na rota registerParks:", error);

    return response.status(500).json({
      message: "Não foi possível cadastrar o seu estacionamento!",
    });
  }
};

export const deletePark = async (request, response) => {
  let db;
  try {
    db = await openDatabase();

    const { id } = request.params;

    const result = await db.run(`DELETE FROM parks WHERE id_park = ?`, [id]);

    if (result.changes === 0) {
      return response
        .status(404)
        .json({ message: "Estacionamento não encontrado." });
    }

    return response.json({ message: "Registro deletado com sucesso." });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Erro ao deletar registro." });
  } finally {
    if (db) await db.close();
  }
};

export const updatePark = async (request, response) => {
  let db;
  try {
    db = await openDatabase();
    const { id } = request.params;
    const { new_name } = request.body;

    const park = await db.get(`SELECT * FROM parks WHERE id_park = ?`, [id]);

    if (!park) {
      return response
        .status(404)
        .json({ message: "Estacionamento não encontrado!" });
    }

    const result = await db.run(
      `UPDATE parks SET park_name = ? WHERE id_park = ?`,
      [new_name || park.park_name, id],
    );


    if (result.changes === 0) {
      return response.status(400).json({
        message:
          "Nenhuma alteração foi feita.",
      });
    }

    return response.json({ message: "Estacionamento atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar estacionamento:", error);
    return response
      .status(500)
      .json({ message: "Erro ao atualizar estacionamento." });
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error("Erro ao fechar o banco no finally:", closeError);
      }
    }
  }
};
