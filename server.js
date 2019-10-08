// const express = require("express");
// const app = express();
const app = require('./app')

app.set("port", process.env.PORT || 3000);
// app.locals.title = "Palette Picker";

// app.get("/", (request, response) => {
//   response.send("This is the future home of Palette Picker");
// });

app.listen(app.get("port"), () => {
  console.log(`${app.locals.title} is running. Hooray!`);
});

// //get all folders
// app.get("/api/v1/folders", (request, response) => {
//   database("folders")
//     .select()
//     .then(folders => {
//       response.status(200).json(folders);
//     })
//     .catch(error => {
//       response.status(500).json({ error });
//     });
// });

// //get all palettes
// app.get("/api/v1/palettes", (request, response) => {
//   database("palettes")
//     .select()
//     .then(palettes => {
//       response.status(200).json(palettes);
//     })
//     .catch(error => {
//       response.status(500).json({ error });
//     });
// });

// //get specific folder
// app.get("/api/v1/folders/:id", (request, response) => {
//   database("folders")
//     .where("id", request.params.id)
//     .select()
//     .then(folder => {
//       response.status(200).json(folder);
//     })
//     .catch(error => {
//       response.status(500).json({
//         error: `Could not find folder with id of ${request.params.id}`
//       });
//     });
// });

// //get a specific palette
// app.get("/api/v1/palettes/:id", (request, response) => {
//   database("palettes")
//     .where("id", request.params.id)
//     .select()
//     .then(palette => {
//       response.status(200).json(palette);
//     })
//     .catch(error => {
//       response.status(500).json({
//         error: `Could not find palette with id of ${request.params.id}`
//       });
//     });
// });

// //post to folders
// app.post("/api/v1/folders", (request, response) => {
//   const folder = request.body;
//   for (let requiredParameter of ["folder"]) {
//     if (!folder[requiredParameter]) {
//       return response.status(422).send({
//         error: `Expected format: { folder: <String> }. You're missing a "${requiredParameter}" property.`
//       });
//     }
//   }
// });

// //post to palettes
// app.post("/api/v1/palettes", (request, response) => {
//   const folder = request.body;
//   for (let requiredParameter of [
//     "folder_id",
//     "color1",
//     "color2",
//     "color3",
//     "color4",
//     "color5"
//   ]) {
//     if (!folder[requiredParameter]) {
//       return response.status(422).send({
//         error: `Expected format: { folder_id: <String>, color1: <Number>, color2: <Number>, color3: <Number>, color4: <Number>, color5: <Number>, }. You're missing a "${requiredParameter}" property.`
//       });
//     }
//   }
// });

// //this will delete one folder

// //probably need to first go into palette and delete palettes with matching id first and then remove folder
// app.delete("/api/v1/folders/:id", (request, response) => {
//   //database('palettes').where('folder_id, request.params.id).del()
//   //.then
//   database("folders")
//     .where("id", request.params.id)
//     .del()
//     .then(res => {
//       if (res) {
//         response
//           .status(200)
//           .send(`Folder with the id of ${request.params.id} has been deleted`);
//       } else {
//         response
//           .status(404)
//           .send(`Could not find folder with the id of ${request.params.id}`);
//       }
//     })
//     .catch(error => {
//       response.status(500).send({ error });
//     });
// });

// //this function will delete a palette
// app.delete("/api/v1/palettes/:id", (request, response) => {
//   database("palettes")
//     .where("id", request.params.id)
//     .del()
//     .then(res => {
//       if (res) {
//         response
//           .status(200)
//           .send(`Palette with the id of ${request.params.id} has been deleted`);
//       } else {
//         response
//           .status(404)
//           .send(`Could not find palette with the id of ${request.params.id}`);
//       }
//     })
//     .catch(error => {
//       response.status(500).send({ error });
//     });
// });

// //this function MIGHT patch a palette
// app.patch("/api/v1/palettes/:id", (request, response) => {
//   for (let requiredParameter of [
//     "folder_id",
//     "color1",
//     "color2",
//     "color3",
//     "color4",
//     "color5"
//   ]) {
//     if (!request.body[requiredParameter]) {
//       return response.status(422).send({
//         error: `Expected format: { folder_id: <String>, color1: <Number>, color2: <Number>, color3: <Number>, color4: <Number>, color5: <Number>, }. You're missing a "${requiredParameter}" property.`
//       });
//     }
//     database("palettes")
//       .where("id", request.params.id)
//       .update({ ...request.body })
//       //it feels like I should just fire this
//       .then(() => response.status(202).json({ id: request.params.id }))
//       .catch(error => response.status(500).json({ error }));
//   }
// });

// //this function MIGHT patch a folder
// app.patch('/api/v1/folders/:id', (request, response) => {
//     for (let requiredParameter of [
//         'name'
//     ]) {
//         if(!request.body.palette[requiredParameter]) {
//             return response.status(422).send({
//                 error: `Expected format { name: <String>. Your missing a ${requiredParameter} property}`
//             })
//         }
//         database("folders")
//         .where("id", request.params.id)
//         .update({...request.body })
//         //it feels like I should just fire this
//         .then(() => response.status(202).json({id: request.params.id}))
//         .catch(error => response.status(500).json({error}))
//     }
// })

module.exports = app;