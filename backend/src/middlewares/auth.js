import 'dotenv/config';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (request, response, next) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(401).json({ message: "Você não está logado!" });
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
        return response.status(401).json({ message: "Erro no formato do token!" });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return response.status(401).json({ message: "Token mal formatado!" });
    }

    jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if (error) {
            console.error("Erro JWT:", error.message);
            return response.status(401).json({ message: "Token inválido ou expirado!" });
        }

        request.userId = decoded.id;

        return next();
    });
};
