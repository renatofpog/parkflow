import 'dotenv/config';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { openDatabase } from "../database.js";

export const listUsers = async (request, response) => {
  try {
    const db = await openDatabase();
    const users = await db.all(`SELECT * FROM users`);
    await db.close();
    return response.status(200).json(users);
  } catch (error) {
    response.status(500).send({ message: "Erro ao listar usuários." });
  }
};

export const createUser = async (request, response) => {
  let db;
  try {
    const { name_user, email_user, password_user } = request.body;

    if (!name_user || !email_user || !password_user) {
      return response
        .status(400)
        .json({ message: "Preencha todos os campos!" });
    }

    const hashedPassword = await bcrypt.hash(password_user, 10);

    db = await openDatabase();

    const data = await db.run(
      `
        INSERT INTO users (name_user, email_user, password_user, admin_level, premium_level)
        VALUES (?, ?, ?, 5, 5)    
        `,
      [name_user, email_user, hashedPassword],
    );
    await db.close();
    return response.status(201).json({
      id: data.lastID,
      name_user,
      email_user,
    });
  } catch (error) {
    if (db) await db.close();
    console.log(error);
    return response.status(500).send({
      message: "Não foi possível cadastrar no banco de dados. Tente novamente!",
    });
  }
};

export const updateUser = async (request, response) => {
  let db;
  try {
    const { new_name, new_email, new_password } = request.body;
    const { id } = request.params;
    
    db = await openDatabase();

    const user = await db.get(`SELECT * FROM users WHERE id_user = ?`, [id]);

    if (!user) {
      await db.close();
      return response.status(404).json({ message: "Usuário não encontrado" });
    }

    const hashedPassword = new_password 
      ? await bcrypt.hash(new_password, 10) 
      : user.password_user;

    await db.run(
      `UPDATE users SET name_user = ?, email_user = ?, password_user = ? WHERE id_user = ?`,
      [new_name || user.name_user, new_email || user.email_user, hashedPassword, id]
    );
    
    await db.close();

    return response.status(200).json({
      id,
      new_name: new_name || user.name_user,
      new_email: new_email || user.email_user,
    });

  } catch (error) {
    if (db) await db.close();
    console.log(error);
    return response.status(500).json({ message: "Erro ao atualizar conta." });
  }
};

export const deleteUser = async (request, response) => {
  let db;
  try {
    const { id } = request.params;
    db = await openDatabase();

    await db.run(`DELETE FROM users WHERE id_user = ?`, [id]);
    
    await db.close();
    
    return response.status(200).json({
      id,
      message: `O usuário ${id} foi deletado com sucesso!`,
    });
  } catch (error) {
    if (db) await db.close();
    return response.status(400).json("Não foi possível excluir sua conta.");
  }
};

export const loginUser = async (request, response) => {
  let db;
  try {
    const { email_user, password_user } = request.body;
    if (!email_user || !password_user) {
      return response
        .status(400)
        .json({ message: "E-mail e senha são obrigatórios." });
    }
    db = await openDatabase();

    const user = await db.get(`SELECT * FROM users WHERE email_user = ?`, [email_user]);
    if (!user) {
      await db.close();
      return response
        .status(401)
        .json({ message: "E-mail ou senha incorretos." });
    }

    const passwordMatch = await bcrypt.compare(password_user, user.password_user);
    if (!passwordMatch) {
      await db.close();
      return response
        .status(401)
        .json({ message: "E-mail ou senha incorretos." });
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    const token = jwt.sign(
      { id: user.id_user, email_user: user.email_user }, JWT_SECRET,
      { expiresIn: "1h" },
    );

    await db.close();
    return response.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      user: { id_user: user.id_user, name_user: user.name_user, email_user: user.email_user },
    });
  } catch (error) {
    if (db) await db.close();
    console.error(error);
    return response.status(500).json({ message: "Erro ao realizar login." });
  }
};
