import { openDatabase } from "../database.js";

export const listVehicles = async (request, response) => {
  let db;

  try {
    db = await openDatabase();
    const vehicles = await db.all(`
        SELECT * FROM vehicles
            `);

    return response.status(200).json(vehicles);
  } catch (error) {
    console.error("Erro ao listar veículos:", error);
    return response.status(500).json({ message: "Erro ao listar veículos!" });
  } finally {
    if (db) await db.close();
  }
};

export const registerVehicles = async (request, response) => {
  let db;
  try {
    const { model_vehicle, year_vehicle, label_vehicle, owner_vehicle } =
      request.body;

    if (!model_vehicle || !year_vehicle || !label_vehicle || !owner_vehicle) {
      return response.status(400).json({
        message: "Todos os campos são obrigatórios.",
      });
    }

    db = await openDatabase();

    const checkLabelVehicle = await db.get(
      `SELECT id_vehicle FROM vehicles WHERE label_vehicle = ?`,
      [label_vehicle],
    );

    if (checkLabelVehicle) {
      return response.status(409).json({
        message: "Já existe um veículo cadastrado com esta placa.",
      });
    }

    const data = await db.run(
      `
        INSERT INTO vehicles (model_vehicle, year_vehicle, label_vehicle, owner_vehicle)
        VALUES (?, ?, ?, ?)`,
      [model_vehicle, year_vehicle, label_vehicle, owner_vehicle],
    );
    await db.close();

    return response.status(201).json({
      id: data.lastID,
      model_vehicle,
      year_vehicle,
      label_vehicle,
      owner_vehicle,
    });
  } catch (error) {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error("Erro ao fechar o banco no catch:", closeError);
      }
    }

    console.error("Erro na rota registervehicle:", error);

    return response.status(500).json({
      message: "Não foi possível cadastrar o seu veículo!",
    });
  }
};

export const deleteVehicle = async (request, response) => {
  let db;
  try {
    db = await openDatabase();

    const { id } = request.params;

    const result = await db.run(`DELETE FROM vehicles WHERE id_vehicle = ?`, [
      id,
    ]);

    if (result.changes === 0) {
      return response.status(404).json({ message: "Veículo não encontrado." });
    }

    return response.json({ message: "Registro deletado com sucesso." });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Erro ao deletar registro." });
  } finally {
    if (db) await db.close();
  }
};

export const updateVehicle = async (request, response) => {
  let db;
  try {
    db = await openDatabase();
    const { id } = request.params;
    const { new_model, new_year, new_label, new_owner } = request.body;

    const vehicle = await db.get(
      `SELECT * FROM vehicles WHERE id_vehicle = ?`,
      [id],
    );

    if (!vehicle) {
      return response.status(404).json({ message: "Veículo não encontrado!" });
    }

    await db.run(
      `UPDATE vehicles 
       SET model_vehicle = ?, year_vehicle = ?, label_vehicle = ?, owner_vehicle = ? 
       WHERE id_vehicle = ?`,
      [
        new_model ?? vehicle.model_vehicle,
        new_year ?? vehicle.year_vehicle,
        new_label ?? vehicle.label_vehicle,
        new_owner ?? vehicle.owner_vehicle,
        id,
      ],
    );

    return response.json({ message: "Veículo atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Erro ao atualizar veículo." });
  } finally {
    if (db) await db.close();
  }
};
