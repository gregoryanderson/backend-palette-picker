let foldersData = [
  {
    name: 'Test Folder 1',
    palettes: [
      { name: 'Test Palette 1',
        color1: '#FF5733',
        color2: '#0D1E6D',
        color3: '#176D0D',
        color4: '#C2E436',
        color5: '#570E43'
      },
      { name: 'Test Palette 2',
        color1: '#20570E',
        color2: '#1316C4',
        color3: '#ABADFF',
        color4: '#00F997',
        color5: '#900C3F'
      }
    ]
  },
  {
    name: 'Test Folder 2',
    palettes: [
      { name: 'Test Palette 3',
        color1: '#FF5733',
        color2: '#0D1E6D',
        color3: '#176D0D',
        color4: '#C2E436',
        color5: '#570E43'
      },
      { name: 'Test Palette 4',
        color1: '#20570E',
        color2: '#1316C4',
        color3: '#ABADFF',
        color4: '#00F997',
        color5: '#900C3F'
      }
    ]
  }
]


const createFolder = (knex, folder) => {
  return knex('folders').insert({
    name: folder.name
  }, 'id')
    .then(folderId => {
      let palettesPromises = [];

      folder.palettes.forEach(palette => {
        palettesPromises.push(
          createPalette(knex, {
            name: palette.name,
            folder_id: folderId[0],
            color1: palette.color1,
            color2: palette.color2,
            color3: palette.color3,
            color4: palette.color4,
            color5: palette.color5
          })
        )
      })

      return Promise.all(palettesPromises);
    })
}

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette)
} ;

exports.seed = (knex) => {
  return knex('palettes').del()
    .then(() => knex('folders').del())
    .then(() => {
      let folderPromises = [];

      foldersData.forEach(folder => {
        folderPromises.push(createFolder(knex,folder));
      })

      return Promise.all(folderPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
}