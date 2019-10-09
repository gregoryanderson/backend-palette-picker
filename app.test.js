const request = require('supertest')
const app = require('./app')
import 'regenerator-runtime/runtime'
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);


describe("Server", () => {
  

  describe("init", () => {
    it("should return a 200 status", async () => {
      const res = await request(app).get("/api/v1/folders");
      expect(res.status).toBe(200);
    });
  });

  describe("GET /folders", () => {
    it('should return a 200 and all of the folders', async () => {
      const expectedFolders = await database('folders').select();

      const res = await request(app).get('/api/v1/folders');
      const folders = res.body;

      expect(res.status).toBe(200);
      expect(folders[0].id).toEqual(expectedFolders[0].id)
      expect(folders[0].name).toEqual(expectedFolders[0].name)

    })
  })

  describe('GET /folders/:id', () =>{
    it('should return a 200 and a single folder if the folder exists', async () => {
      const expectedFolder = await database('folders').first();
      const id = expectedFolder.id;

      const res = await request(app).get(`/api/v1/folders/${id}`);
      const folder = res.body[0];

      expect(res.status).toBe(200);
      expect(folder.id).toEqual(expectedFolder.id)
      expect(folder.name).toEqual(expectedFolder.name)
    })
  })
});
