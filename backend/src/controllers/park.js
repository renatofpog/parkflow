import { openDatabase } from "../database";

export const listParks = async (request, response) => {
    let db;
    try {
        db = await openDatabase()

        const results = await db.all(`SELECT * FROM parks`)

        return response.status(200).json(results)
    } catch (error) {
        console.error("Erro ao listar os estacionamentos criados!", error)
        
    }
}