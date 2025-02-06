import { createConnection } from "../database";
import bcrypt from "bcrypt";
import * as mysql from "mysql2/promise";
import { UserModel } from "../models/user-model";

export class CustomerService {

    async register(data: {
        name: string;
        email: string;
        password: string;
        address: string;
        phone: string;
    }) {
        const { name, email, password, address, phone } = data;
        const connection = await createConnection();
    
        try{
            const createdAt = new Date();
            const hashedPassword = bcrypt.hashSync(password, 10); // Quando maior o salt melhor vai ser a criptografia da senha
            const userModel = await UserModel.create({
                name,
                email,
                password: hashedPassword,
            })
            const userId = userModel.id;
            const [partnerResult] = await connection.execute<mysql.ResultSetHeader>(
                "INSERT INTO customers (user_id, address, phone, created_at) VALUES (?, ?, ?, ?)", 
                [userId, address, phone, createdAt]
            );
            return {id: partnerResult.insertId, name, userId: userId, address, phone, created_at: createdAt};
        } finally {
            await connection.end();
        }
    }

}