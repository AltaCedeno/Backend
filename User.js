import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // Ajusta la ruta según tu proyecto

const User = sequelize.define(  
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        fecha_registro: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        
        // admin: {
        //     type: DataTypes.BOOLEAN,
        //     allowNull: false,
        //     defaultValue: false,
        // },
    },
    {
        tableName: "usuarios",   // Nombre de la tabla en BD
        timestamps: false,     // Evita createdAt/updatedAt automáticos
    }
);

export default User;
