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

  describe("GET /api/v1/folders", () => {
    it('should return a 200 and all of the folders', async () => {
      const expectedFolders = await database('folders').select();

      const res = await request(app).get('/api/v1/folders');
      const folders = res.body;

      expect(res.status).toBe(200);
      expect(folders[0].id).toEqual(expectedFolders[0].id)
      expect(folders[0].name).toEqual(expectedFolders[0].name)

    })
  })

  describe('GET /api/v1/folders/:id', () => {
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

  describe('POST /api/v1/folders', () => {
    
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


  describe('DELETE /api/v1/folders', () => {

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
    
    it('should update the database if deletion is successful', async () => {
      let allFoldersInitial = await database('folders').select();
      let folderToDelete = allFoldersInitial[0];
      let id = folderToDelete.id
    
      
      const res = await request(app).delete(`/api/v1/folders/${id}`)

      const allFoldersFinal = await database('folders').select();

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

  describe('PATCH /api/v1/folders/:id', () => {
    beforeEach(async () => {
      await database.seed.run();
    });

    it('should return a 202 status with the id of the edited folder when successful', async () => {

      let allFoldersInitial = await database('folders').select();
      let folderToUpdate = allFoldersInitial[0];
      let id = parseInt(folderToUpdate.id);
      let newFolderInfo = { name: 'NEW NAME'};

      let response = await request(app).patch(`/api/v1/folders/${id}`).send(newFolderInfo)

      expect(response.status).toBe(202);

      expect(response.body).toEqual({ id: id })

    })

    it('should update the database with information when successful', async () => {

      let allFoldersInitial = await database('folders').select();
      let folderToUpdate = allFoldersInitial[0];
      let id = parseInt(folderToUpdate.id);
      let newFolderInfo = { name: 'NEW NAME'};

      let response = await request(app).patch(`/api/v1/folders/${id}`).send(newFolderInfo)

      let updatedFolder = await database('folders').where('id', id).first();

      expect(updatedFolder.name).toEqual(newFolderInfo.name)

    })

    it('should return a 422 status with message if name parameter is missing', async () => {

      
      let allFoldersInitial = await database('folders').select();
      let folderToUpdate = allFoldersInitial[0];
      let id = parseInt(folderToUpdate.id);
      let newFolderInfo = { name: false };

      let response = await request(app).patch(`/api/v1/folders/${id}`).send(newFolderInfo)

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual(`Expected format { name: <String>. You are missing a name property}`)

    })

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
})

  })
