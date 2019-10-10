const express = require("express");
const app = express();
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);
const cors = require("cors");

app.locals.title = "Palette Picker";

// app.use(cors())
app.use(express.json());

app.get("/api/v1/folders", (request, response) => {
  if (request.query.name) {
    let lowercase = request.query.name.toLowerCase();
    database("folders")
      .whereRaw("LOWER(name) LIKE ?", lowercase)
      .then(folders => {
        if (folders.length === 0) {
          return response.status(404).json({error: `Could not find folder with name ${request.query.name}`})
        } else {
          response.status(200).json(folders);
        }
      })
  } else {
    database("folders")
      .select()
      .then(folders => {
        response.status(200).json(folders);
      })
      .catch(error => {
        response.status(404).json({ error });
      });
  }
});

app.get("/api/v1/palettes", (request, response) => {
  database("palettes")
    .select()
    .then(palettes => {
      response.status(200).json(palettes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get("/api/v1/folders/:id", (request, response) => {
  database("folders")
    .where("id", request.params.id)
    .select()
    .then(folders => {
      if (folders.length) {
        response.status(200).json(folders);
      } else {
        response.status(404).json({
          error: `Could not find folder with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get("/api/v1/palettes/:id", (request, response) => {
  database("palettes")
    .where("id", request.params.id)
    .select()
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes);
      } else {
        response.status(404).json({
          error: `Could not find palette with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post("/api/v1/folders", (request, response) => {
  const folder = request.body;
  for (let requiredParameter of ["name"]) {
    if (!folder[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.`
      });
    }
  }
  database("folders")
    .insert(folder, "id")
    .then(folderId => response.status(201).json({ id: folderId[0] }))
    .catch(error => response.status(500).json({ error }));
});

app.post("/api/v1/palettes", (request, response) => {
  const palette = request.body;
  for (let requiredParameter of [
    "folder_id",
    "color1",
    "color2",
    "color3",
    "color4",
    "color5",
    "name"
  ]) {
    if (palette[requiredParameter] === undefined) {
      return response.status(422).send({
        error: `Expected format: { folder_id: <String>, color1: <Number>, color2: <Number>, color3: <Number>, color4: <Number>, color5: <Number>, name: <String> }. Youre missing a "${requiredParameter}" property.`
      });
    }
  }
  database("palettes")
    .insert(palette, "id")
    .then(paletteId => response.status(201).json({ id: paletteId[0] }))
    .catch(error => response.status(500).json({ error }));
});

app.delete("/api/v1/folders/:id", async (request, response) => {
  let id = request.params.id;

  database("palettes")
    .where("folder_id", id)
    .del()
    .then(res => {
      database("folders")
        .where("id", id)
        .del()
        .then(res => {
          if (res) {
            response
              .status(200)
              .json(`Folder with the id of ${id} has been deleted.`);
          } else {
            response
              .status(404)
              .json({ error: `Could not find folder with the id of ${id}` });
          }
        });
    })
    .catch(error => {
      response.status(500).send({ error });
    });
});

app.delete("/api/v1/palettes/:id", (request, response) => {
  database("palettes")
    .where("id", request.params.id)
    .del()
    .then(res => {
      if (res) {
        response
          .status(200)
          .json(`Palette with the id of ${request.params.id} has been deleted`);
      } else {
        response
          .status(404)
          .json(`Could not find palette with the id of ${request.params.id}`);
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.patch("/api/v1/palettes/:id", (request, response) => {
  for (let requiredParameter of [
    "folder_id",
    "color1",
    "color2",
    "color3",
    "color4",
    "color5",
    "name"
  ]) {
    if (!request.body[requiredParameter]) {
      return response.status(422).json({
        error: `Expected format: { folder_id: <String>, color1: <Number>, color2: <Number>, color3: <Number>, color4: <Number>, color5: <Number>, name: <String> }. You're missing a "${requiredParameter}" property.`
      });
    }
  }
  database("palettes")
    .where("id", request.params.id)
    .update({ ...request.body })
    .then(() => response.status(202).json({ id: request.params.id }))
    .catch(error => response.status(500).json({ error }));
});

app.patch("/api/v1/folders/:id", (request, response) => {
  for (let requiredParameter of ["name"]) {
    if (!request.body[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format { name: <String>. You are missing a ${requiredParameter} property}`
      });
    }
    database("folders")
      .where("id", request.params.id)
      .update({ ...request.body })
      .then(() =>
        response.status(202).json({ id: parseInt(request.params.id) })
      )
      .catch(error => response.status(500).json({ error }));
  }
});

module.exports = app;
