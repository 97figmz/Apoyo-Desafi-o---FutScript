const request = require("supertest");
const app = require("./index");

describe("Operaciones CRUD FutScript", () => {

    test("GET /equipos debe responder con un Array y status 200", async () => {
        const response = await request(app).get("/equipos");

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test("POST /login con credenciales correctas debe responder con un Object", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                username: "admin",
                password: "1234"
            });

        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.token).toBeDefined();
    });

    test("POST /login con credenciales incorrectas debe responder status 400", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                username: "admin",
                password: "incorrecta"
            });

        expect(response.statusCode).toBe(400);
    });

    test("POST /equipos/:teamID/jugadores con token válido debe responder status 201", async () => {
        const login = await request(app)
            .post("/login")
            .send({
                username: "admin",
                password: "1234"
            });

        const token = login.body.token;

        const response = await request(app)
            .post("/equipos/1/jugadores")
            .set("Authorization", token)
            .send({
                name: "Luka Modric",
                position: 3
            });

        expect(response.statusCode).toBe(201);
    });

});