import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// import {
//     validateRegistrationData,
//     validateLoginData
// } from "../utils/validationUtils.js";

// import {
//     generateToken,
//     generateAuthResponse
// } from "../utils/authUtils.js";

dotenv.config();


// -------------------------------------------------------------------
// REGISTRO DE USUARIO (SEQUELIZE)
// -------------------------------------------------------------------
export const registerUser = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // // Validación
        // const validacion = validateRegistrationData({ nombre, email, password });
        // if (!validacion.isValid) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Datos inválidos para registro",
        //         errors: validacion.errors
        //     });
        // }

        // Verificar si ya existe
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({
                success: false,
                error: "El usuario ya existe"
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const newUser = await User.create({
            nombre,
            email,
            password: hashedPassword,
            fecha_registro: new Date() // aunque Sequelize ya usa NOW
        });

        return res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente",
            user: {
                id: newUser.id,
                nombre: newUser.nombre,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("❌ Error en registerUser:", error);
        return res.status(500).json({
            success: false,
            error: "Error interno en registro"
        });
    }
};



// -------------------------------------------------------------------
// LOGIN DE USUARIO (SEQUELIZE)
// -------------------------------------------------------------------
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // // Validación
        // const validacion = validateLoginData({ email, password });
        // if (!validacion.isValid) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Datos inválidos para login",
        //         errors: validacion.errors
        //     });
        // }

        // Buscar usuario
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Usuario no encontrado"
            });
        }

        // Verificar contraseña
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(401).json({
                success: false,
                error: "Contraseña incorrecta"
            });
        }

        // -----------------------
        // Crear JWT directamente
        // -----------------------
        const payload = { id: user.id};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h' // Duración del token
        });

  
    // const payload = { id: user.id, tipoUser: user.admin' };
    // const token = jwt.sign(payload, process.env.JWT_SECRET, {
    //     expiresIn: '1h' // Duración del token
    // });


        // -----------------------
        // Respuesta de autenticación
        // -----------------------
        const authResponse = {
            success: true,
            message: 'Login exitoso',
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email
            },
            token
        };
        return res.status(201).json({
            success: true,
            message: 'Login exitoso',
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email
            },
            token});

    } catch (error) {
        console.error("❌ Error en loginUser:", error);
        return res.status(500).json({
            success: false,
            error: "Error interno en login"
        });
    }
};
