const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'futscript',
    allowExitOnIdle: true
})

const getTeams = async () => {
    const consulta = "SELECT * FROM equipos";
    const { rows } = await pool.query(consulta);
    return rows;
}

const getPlayers = async (teamID) => {
    const consulta = `
        SELECT jugadores.name, posiciones.name AS posicion
        FROM jugadores
        INNER JOIN posiciones
        ON jugadores.position = posiciones.id
        WHERE jugadores.id_equipos = $1
    `;

    const { rows } = await pool.query(consulta, [teamID]);
    return rows;
}

const addTeam = async (equipo) => {
    const consulta = "INSERT INTO equipos (name) VALUES ($1)";
    const values = [equipo.name];

    await pool.query(consulta, values);
}

const addPlayer = async ({ jugador, teamID }) => {
    const consulta = `
        INSERT INTO jugadores (id_equipos, position, name)
        VALUES ($1, $2, $3)
    `;

    const values = [teamID, jugador.position, jugador.name];

    await pool.query(consulta, values);
}

module.exports = { getTeams, addTeam, getPlayers, addPlayer }