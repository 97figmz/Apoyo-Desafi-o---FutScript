const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const { secretKey } = require('./utils');

const { obtenerJugadores, registrarJugador } = require('./controllers/jugadores');
const { obtenerEquipos, agregarEquipo } = require('./controllers/equipos');

app.use(express.json());

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        const token = jwt.sign({ username }, secretKey, {
            expiresIn: "5m"
        });

        return res.json({ token });
    }

    return res.status(400).json({
        message: "Credenciales incorrectas"
    });
});

// MIDDLEWARE PARA VALIDAR TOKEN
const verificarToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({
            message: "Token no proporcionado"
        });
    }

    try {
        jwt.verify(token, secretKey);
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token inválido"
        });
    }
};

// RUTAS DE EQUIPOS
app.get("/equipos", obtenerEquipos);
app.post("/equipos", verificarToken, agregarEquipo);

// RUTAS DE JUGADORES
app.get("/equipos/:teamID/jugadores", obtenerJugadores);
app.post(
    "/equipos/:teamID/jugadores",
    verificarToken,
    registrarJugador
);

// SERVIDOR
app.listen(3000, () => {
    console.log("SERVER ON");
});
module.exports = app;