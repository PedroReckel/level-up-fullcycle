import { Router } from "express";
import bcrypt from "bcrypt";
import * as mysql from "mysql2/promise";
import { createConnection } from "../database";

export const customerRoutes = Router();

customerRoutes.post("/register", async (req, res) => {
    const { name, email, password, address, phone } = req.body;
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
            "INSERT INTO customers (user_id, address, phone, created_at) VALUES (?, ?, ?, ?)", 
            [userId, address, phone, createdAt]
        );
        res.status(201).json({id: partnerResult.insertId, name, userId: userId, address, phone, created_at: createdAt});
    } finally {
        await connection.end();
    }

});