const request = require('supertest')
const app = require('./app')
// import 'regenerator-runtime/runtime'
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);


describe("Server", () => {
  
  beforeEach(async() => {
    await database.seed.run()
  })

  describe("init", () => {
    it("should return a 200 status", async () => {
      const res = await request(app).get("/api/v1/folders");
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/v1/palettes", () => {
    it("should return a 200 and all palettes", async () => {
      const expectedPalette = await database('palettes').select()

      const res = await request(app).get('/api/v1/palettes');
      const palettes = res.body;

      expect(res.status).toBe(200)
      expect(JSON.stringify(palettes)).toEqual(JSON.stringify(expectedPalette))
    })
  })

  describe("GET /api/v1/palettes/:id", () => {
    it("should return a 200 and a single palette if the id exists", async () => {
      const expectedPalette = await database('palettes').first()
      const id = expectedPalette.id


      const res = await request(app).get(`/api/v1/palettes/${id}`)
      const result = res.body[0]

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedPalette))
      expect(res.status).toBe(200)
    })

    it("should return an error when a palette is not found", async() => {
      const invalidId = -1;
      const response = await request(app).get(`/api/v1/palettes/${invalidId}`)
      expect(response.status).toBe(404)
      expect(response.body.error).toEqual(`Could not find palette with id -1`)
    })
  })

  describe("POST /api/v1/palettes", () => {
    it("should post a new palette to the database", async() => {
      const folder = await database('folders').first()
      const newPalette = {folder_id: folder.id, color1: "green", color2: "blue", color3: "purple", color4: "white", color5: "blue", name: "Pumpkin Spice"}

      const res = await request(app)
                          .post('/api/v1/palettes')
                          .send(newPalette)

      const palettes = await database('palettes').where('id', res.body.id).select()
      const palette = palettes[0]

      expect(res.status).toBe(201)
      expect(palette.name).toBe(newPalette.name)
    })

    it('should return a 422 error when a required parameter is missing', async() => {
      const folder = await database('folders').first()
      const newPalette = {folder_id: folder.id, color2: "blue", color3: "purple", color4: "white", color5: "blue", name: "Pumpkin Spice"}

      const res = await request(app).post('/api/v1/palettes').send(newPalette)

      expect(res.status).toBe(422)
      expect(res.body.error).toBe('Expected format: { folder_id: <String>, color1: <Number>, color2: <Number>, color3: <Number>, color4: <Number>, color5: <Number>, name: <String> }. Youre missing a "color1" property.')
    })
  })

  describe("DELETE /api/v1/palettes", () => {
    it("should delete a palette from the palette table", async() => {
      let allPalettes = await database('palettes').select()
      let paletteToDelete = allPalettes[0]
      let deletedId = paletteToDelete.id

      const res = await request(app).delete(`/api/v1/palettes/${deletedId}`)

      expect(res.status).toBe(200)
      expect(res.body).toEqual(`Palette with the id of ${deletedId} has been deleted`)
    })

    it("should send a 404 status and an error message if there palette cannot be deleted", async() => {
      const invalidId = -1
      const res = await request(app).delete(`/api/v1/palettes/${invalidId}`)

      expect(res.status).toBe(404)
      expect(res.body).toBe(`Could not find palette with the id of ${invalidId}`)
    })
  })

  describe("PATCH /api/v1/palettes/:id", () => {
    it("should patch a palette from the palettes and send back a 200 code", async() => {
      let folder = await database('folders').select().first()
      let palette = await database('palettes').select().first()
      let paletteId = palette.id; 
      let newPalette = {folder_id: folder.id, color1: "brown", color2: "blue", color3: "purple", color4: "white", color5: "blue", name: "Pumpkin Spice"}

      const res = await request(app).patch(`/api/v1/palettes/${paletteId}`).send(newPalette)

      expect(res.status).toBe(202)
      expect(res.body.id).toEqual(JSON.stringify(paletteId))
    })

    it("should throw an error message and a 422 status if requirements have not been met", async() => {
      let folder = await database('folders').select().first()
      let palette = await database('palettes').select().first()
      let paletteId = palette.id; 
      let newPalette = {folder_id: folder.id, color2: "blue", color3: "purple", color4: "white", color5: "blue", name: "Pumpkin Spice"}  
      
      const res = await request(app).patch(`/api/v1/palettes/${paletteId}`).send(newPalette)

      expect(res.status).toBe(422)
      expect(res.body.error).toBe(`Expected format: { folder_id: <String>, color1: <Number>, color2: <Number>, color3: <Number>, color4: <Number>, color5: <Number>, name: <String> }. You're missing a \"color1\" property.`)
    })
  })
});
