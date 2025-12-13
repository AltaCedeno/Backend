import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

let sequelize;

const dbType = process.env.DB_TYPE;

// ===== CONFIGURACIÓN PARA MYSQL =====
if (dbType === "mysql") {
    sequelize = new Sequelize(
        process.env.MYSQL_DATABASE,
        process.env.MYSQL_USER,
        process.env.MYSQL_PASSWORD,
        {
            host: process.env.MYSQL_HOST,
            dialect: "mysql",
            logging: false,
        }
    );

    console.log("📌 Usando Sequelize con MySQL");


// ===== CONFIGURACIÓN PARA POSTGRESQL =====
} else if (dbType === "postgres") {
    sequelize = new Sequelize(
        process.env.PG_DATABASE,
        process.env.PG_USER,
        process.env.PG_PASSWORD,
        {
            host: process.env.PG_HOST,
            port: process.env.PG_PORT || 5432,
            dialect: "postgres",
            logging: false,
        }
    );

    console.log("📌 Usando Sequelize con PostgreSQL");


} else {
    throw new Error("❌ DB_TYPE no válido. Usa 'mysql' o 'postgres'");
}

// Probar conexión
(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexión exitosa con Sequelize");
    } catch (error) {
        console.error("❌ Error conectando con Sequelize:", error);
    }
})();

export default sequelize;
