'use strict';

import fsPromise from 'fs/promises';
import readline from 'readline';
import mongoose from 'mongoose';


import {dbConnection} from './database/config.js';
import Anuncio from './models/anuncio.js';

// Conectamos a la Base de Datos
dbConnection();


async function main() {

    const borrar = await pregunta('Estas seguro de que quieres borrar la base de datos?');
    if (!borrar) {
      process.exit(0);
    }
  
    // inicializar agentes
    await initAnuncios();
  
    // desconectar la base de datos
    mongoose.connection.close()
}

  async function initAnuncios() {
    // borrar todos los documentos de agentes que haya en la colección
    const deleted = await Anuncio.deleteMany();
    console.log(`Eliminados ${deleted.deletedCount} anuncios.`);
  
    const data = await fsPromise.readFile('initDB.anuncios.json', 'utf-8');
    const anuncioData = JSON.parse(data);
  
    // crear agentes iniciales
    const anuncio = await Anuncio.insertMany(anuncioData);
    console.log(`Creados ${anuncio.length} Anuncios.`);
  }

  function pregunta(texto) {
    return new Promise((resolve, reject) => {
      // conectar readline a la consola
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      // hacemos pregunta
      rl.question(texto, respuesta => {
        rl.close();
        if (respuesta.toLowerCase() === 'si') {
          resolve(true);
          return;
        }
        resolve(false);
      })
    });
  }

  main();