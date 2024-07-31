import { pool } from "../database/conexion.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import bcrypt from "bcrypt"

const tokenPassword = async (peticion, respuesta) => {
    try {
        const { email } = peticion.body;
        const sql = "SELECT * FROM users WHERE email = ?"
        const [user] = await pool.query(sql, [email]);
        
        if (user.length > 0) {
            console.log(user[0].user_id);
        } else {
            return respuesta.status(404).json({ "message": "Usuario no encontrado" });
        }

        const token = jwt.sign({ user_id: user[0].user_id }, "palabraSecreta", { expiresIn: "2h" });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "proyectoformativoinout@gmail.com",
                pass: "hgks jsru rjyb eeqv" 
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: "proyectoformativoinout@gmail.com",
            to: user[0].email,
            subject: "Restablecer Contraseña In-Out",
            html: `
                <p>Querido Usuario,</p>
                <p>Para restablecer tu contraseña, haz clic en el siguiente botón:</p>
                <a href="http://10.193.129.11:4005/login?token=${token}" style="background-color: #39A900; color: white;
                 padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Restablecer Contraseña</a>
                <p>Si no solicitaste un cambio de contraseña, por favor ignora este correo.</p>
                <p>Saludos,<br>El equipo de In-Out</p>
                <br>
                <img src="cid:senaLogo" alt="SENA" style="width: 100px; height: auto;">
            `,
            attachments: [{
                filename: 'sena.jpg',
                path: './src/img/sena.jpg',
                cid: 'senaLogo' 
            }]
        };
        
        
        

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return respuesta.status(500).json({
                    "message": "No se pudo enviar el Correo",
                    error: error
                });
            }
            respuesta.send({
                "message": "Correo enviado Exitosamente"
            });
        });
    } catch (error) {
        respuesta.status(500);
        respuesta.send(error.message);
    }
}

const resetPassword = async (peticion, respuesta) => {
    try {
        const { token, password } = peticion.body;

        const decoded = jwt.verify(token, "palabraSecreta");
        const user = decoded.user_id;

        const sql = "SELECT * FROM users WHERE user_id = ?";
        const [usuario] = await pool.query(sql, [user]);

        if (usuario.length === 0) {
            return respuesta.status(404).json({
                "message": "Usuario no encontrado"
            });
        }
        // Encriptar la identificación para usarla como contraseña
        const contraseniaForHash = password.toString()
        const saltRounds = 10; // Cost factor for bcrypt
        const hashedPassword = await bcrypt.hash(contraseniaForHash, saltRounds);

        const sqlUpdate = "UPDATE users SET password = ? WHERE user_id = ?";
        const [actualizar] = await pool.query(sqlUpdate, [hashedPassword, user]);

        if (actualizar.affectedRows > 0) {
            return respuesta.status(200).json({
                "message": "Contraseña actualizada"
            });
        } else {
            return respuesta.status(400).json({
                "message": "No se pudo actualizar la contraseña"
            });
        }
    } catch (error) {
        respuesta.status(500);
        respuesta.send(error.message);
    }
}

export const password = {
    tokenPassword,
    resetPassword
}
