const Anuncio = require("../models/anuncio");
const { dbConnection } = require("./config");

db.once('open', async () => {
    try {
      
      // preguntar al usuario si quiere borrar la base de datos
      const respuesta = await askUser('Estás seguro de que quieres borrar TODA la base de datos? (no) ');
  
      if (respuesta.toLowerCase() !== 'si') {
        console.log('Abortado!');
        process.exit(0);
      }
  
      //await initanuncios();
      await initModel(Anuncio, anunciosData, 'anuncios');
  
      db.close();
  
    } catch(err) {
      console.log('Hubo un error', err);
      process.exit(1);
    }
  
});

function askUser(question) {
    return new Promise((resolve, reject) => {
      const interfaz = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      interfaz.question(question, answer => {
        interfaz.close();
        resolve(answer);
        return;
      });
    });
};


dbConnection.Anuncio.insertMany(anuncios, function(error, docs) {
    if (error) {
        throw new Error(error, docs);
    }
    console.log('Se añadieron los anuncios correctamente a la DB');
});

async function initModel(Model, data, modelName) {
    const deleted = await Model.deleteMany();
    console.log(`Eliminados ${deleted.n} ${modelName}.`);
  
    const insertados = await Model.insertMany(data);
    console.log(`Insertados ${insertados.length} ${modelName}.`);
  }