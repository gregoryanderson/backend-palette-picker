exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable("folders", function(table) {
      table.increments("id").primary();
      table.string("name");
      table.timestamps(true, true);
    }),

    knex.schema.createTable("palettes", function(table) {
      table.increments("id").primary();
      table.string("color1");
      table.string("color2");
      table.string("color3");
      table.string("color4");
      table.string("color5");
      table.integer("folder_id").unsigned();
      table.foreign("folder_id").references("folders.id");
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable("palettes"),
    knex.schema.dropTable("folders")
  ]);
};
