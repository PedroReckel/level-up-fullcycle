import { createConnection } from "../database";
import bcrypt from "bcrypt";
import * as mysql from "mysql2/promise";

export class PartnerService {

    async register(data: {
        name: string;
        email: string;
        password: string;
        company_name: string;
    }) {
        const { name, email, password, company_name } = data;
            const connection = await createConnection();
        
            try{
                const createdAt = new Date();
                const hashedPassword = bcrypt.hashSync(password, 10); // Quando maior o salt melhor vai ser a criptografia da senha
                const [userResult] = await connection.execute<mysql.ResultSetHeader>(
                    "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)", 
                    [name, email, hashedPassword, createdAt]
                );
                const userId = userResult.insertId;
                const [partnerResult] = await connection.execute<mysql.ResultSetHeader>(
                    "INSERT INTO partners (user_id, company_name, created_at) VALUES (?, ?, ?)", 
                    [userId, company_name, createdAt]
                );
                return {id: partnerResult.insertId, userId: userId, company_name, created_at: createdAt};
            } finally {;
                await connection.end();
            }
    }

    async findByUserId(userId: number) {
        const connection = await createConnection();
        try {
            const [rows] = await connection.execute<mysql.RowDataPacket[]>(
                "SELECT * FROM partners WHERE user_id = ?",
                [userId]
            );
            return rows.length ? rows[0]: null;
        } finally {
            await connection.end();
        }
    }

}