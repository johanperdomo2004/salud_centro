import { check } from "express-validator";
import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';

export const validar_usuario = [
    
    check('identification')
    .isNumeric().withMessage('la identificación debe ser numérica')
    .notEmpty().withMessage('la identificación no puede estar vacía')
    .isLength({min: 6, max: 10}).withMessage('Debe tener entre 6 y 10 caracteres')
    .custom( async (value) => {
        const sql = "SELECT * FROM users WHERE identification = ?";
        const [result] = await pool.query(sql, [value]);
        if (result.length > 0) {
            throw new Error("La identificación ya está en uso")
        }
    }),
    
    check('name')
    .isString().withMessage('los nombres deben ser texto')
    .notEmpty().withMessage('los nombres no pueden estar vacíos')
    .isLength({min: 3}).withMessage('Deben tener al menos tres caracteres'),

    check('lastname')
    .isString().withMessage('los apellidos deben ser texto')
    .notEmpty().withMessage('los apellidos no pueden estar vacíos')
    .isLength({min: 3}).withMessage('Deben tener al menos tres caracteres'),

    check('phone')
    .isString().withMessage('El teléfono debe ser un string')
    .notEmpty().withMessage('El teléfono no puede estar vacío')
    .isLength({min: 10, max: 12}).withMessage('Debe tener 10 números'),

    check('email')
    .isEmail().withMessage('El correo no es válido')
    .notEmpty().withMessage('El correo no puede estar vacío')
    .custom(async (value) => {
        const sql = "SELECT * FROM users WHERE email = ?";
        const [result] = await pool.query(sql, [value]);
        if (result.length > 0) {
            throw new Error("El email ya está en uso")
        }
    }), 
]

export const Validar_Actualizar = [
    
    check('name')
    .isString().withMessage('los nombres deben ser texto')
    .notEmpty().withMessage('los nombres no pueden estar vacíos')
    .isLength({min: 3}).withMessage('Deben tener al menos tres caracteres'),

    check('lastname')
    .isString().withMessage('los apellidos deben ser texto')
    .notEmpty().withMessage('los apellidos no pueden estar vacíos')
    .isLength({min: 3}).withMessage('Deben tener al menos tres caracteres'),

    check('phone')
    .isNumeric().withMessage('El teléfono debe ser numérico')
    .notEmpty().withMessage('El teléfono no puede estar vacío')
    .isLength({min: 10, max: 12}).withMessage('Debe tener 10 números'),

    check('identification')
    .isNumeric().withMessage('la identificación debe ser numérica')
    .notEmpty().withMessage('la identificación no puede estar vacía')
    .isLength({min: 6, max: 10}).withMessage('Debe tener entre 6 y 10 números'),

    check('email')
        .isEmail().withMessage('El correo no es válido')
        .notEmpty().withMessage('El correo no puede estar vacío'),

    ]
