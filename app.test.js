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

  describe('GET /folders/:id', () => {
    it('should return a 200 and a single folder if the folder exists', async () => {
      const expectedFolder = await database('folders').first();
      const id = expectedFolder.id;

      const res = await request(app).get(`/api/v1/folders/${id}`);
      const folder = res.body[0];

      expect(res.status).toBe(200);
      expect(folder.id).toEqual(expectedFolder.id)
      expect(folder.name).toEqual(expectedFolder.name)
    })

    it('should return a 404 and the message "Folder not found" ', async () => {
      const invalidId = -1;

      const response = await request(app).get(`/api/v1/folders/${invalidId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(`Could not find folder with id ${invalidId}`);
    })
  })

  describe('POST /folders', () => {
    
    beforeEach(async () => {
      await database.seed.run()
    })

    it('should post a new folder to the database and return the unique id', async () => {
      const newFolder = { name: 'My New Favorite Test Palette'};

      const res = await request(app).post('/api/v1/folders').send(newFolder);

      const folders = await database('folders').where('id', res.body.id).select();
      const folder = folders[0];

      expect(res.status).toBe(201);
      expect(folder.name).toEqual(newFolder.name);
    })

    it('should return a 422 and error when name parameter is missing', async () => {
      const newFolder = {};

      const res = await request(app).post('/api/v1/folders').send(newFolder);

      expect(res.status).toBe(422);
      expect(res.body.error).toEqual(`Expected format: { name: <String> }. You're missing a \"name\" property.`)
    })
  })


  describe('DELETE /folders', () => {

    beforeEach(async () => {
      await database.seed.run()
    })

    it('should return a 200 status and confirmation message if a folder with palettes is deleted', async () => {
      let allFoldersInitial = await database('folders').select();
      let folderToDelete = allFoldersInitial[0];
      let id = folderToDelete.id
    
      
      const res = await request(app).delete(`/api/v1/folders/${id}`)

      const allFoldersFinal = await database('folders').select();

      expect(res.status).toBe(200);
      expect(res.body).toEqual(`Folder with the id of ${id} has been deleted.`)
      expect(allFoldersFinal.includes(folderToDelete)).toEqual(false)
      
    })
    
    it('should return a 200 status and confirmation message if a folder without palettes is deleted', async () => {

      // response from posting an empty folder
      const postRes = await request(app).post(`/api/v1/folders/`).send({name: 'Folder with no stuff'})

      // get that empty folder from database
      const emptyFolder = await database('folders').where('id', postRes.body.id).first();

      // delete the empty folder
      const deleteRes = await request(app).delete(`/api/v1/folders/${postRes.body.id}`)

      // final folders array
      const allFoldersFinal = await database('folders').select();
      
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toEqual(`Folder with the id of ${postRes.body.id} has been deleted.`);
      expect(allFoldersFinal.includes(emptyFolder)).toEqual(false)

    })

    it('should return a 404 status and error message if folder is not found', async () => {

      let invalidId = -1;
      let expectedError = { error: 'Could not find folder with the id of -1' }

      const res = await request(app).delete(`/api/v1/folders/${invalidId}`)

      expect(res.status).toBe(404);
      expect(res.body).toEqual(expectedError)
      
    })
  })
});
