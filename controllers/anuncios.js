const { response, request } = require('express');
const  Anuncio = require('../models/anuncio');

const anunciosGet = async(req = request, res = response) => {

    // Establecemos los valores por defecto
    const { 
        limite = 0,
        desde = 0,
        sort = '',
        order = 'asc'
            } = req.query;
    
    // Declaramos la variable que pasaremos por el filtro
    const query = {};

    // Si en la request viene el nombre lo pasamos a la query para filtrar
    if (req.query.nombre) {
        query.nombre = { $regex: req.query.nombre, $options: 'i' };
    }

    // Si en la request viene el venta lo pasamos a la query para filtrar
    if (req.query.venta) {
        query.venta = req.query.venta;
    }

    // Si en la request tags el nombre lo pasamos a la query para filtrar
    if (req.query.tags) {
        query.tags = { $regex: req.query.tags, $options: 'i' };
    }

    // Si en la request maxPrice o minPrice el nombre lo pasamos a la query para filtrar
    if (req.query.maxPrice && req.query.minPrice) {
        query.precio = { '$gte': req.query.minPrice, '$lte': req.query.maxPrice };
    }else if (req.query.maxPrice && !req.query.minPrice) {
        query.precio = { '$lte': req.query.maxPrice };
    }else if (!req.query.maxPrice && req.query.minPrice) {
        query.precio = { '$gte': req.query.minPrice };
    };
    
    // Realizamos la busqueda de anuncios pasandole las variables recibidas como filtros
    const [ total, anuncios ] = await Promise.all([
        Anuncio.countDocuments(query),
        Anuncio.find(query)
            .skip( Number( desde ))
            .limit( Number( limite ))
            .sort(sort)
            .sort({ precio: order })
    ]);

    res.json({
        total,
        anuncios
    });
}

const anunciosPost = async (req, res = response) => {

    const { nombre, venta, precio, foto, tags } = req.body;
    // console.log(req.foto);
    

    // let EDFile = req.files.file

    

    const anuncio = new Anuncio( {
        nombre,
        venta,
        precio,
        foto,
        tags
    } );

    // Verificar si el nombre existe
    // const existeAnuncio = await Anuncio.findOne({ nombre });

    // if ( existeAnuncio ) {
    //     return res.status(400).json({
    //         msg: 'Ese anuncio ya esta registrado'
    //     });
    // };

    // Guardar en BD
    await anuncio.save();

    // EDFile.mv(`./public/assets/uploads/${EDFile.name}`,err => {
    //     if(err) return res.status(500).send({ message : err })
    // });

    res.json({
        anuncio
    });
}

const anunciosPut = async(req, res = response) => {

    const { id } = req.params;
    const data = req.body;

    // const existeAnuncio = await Anuncio.findById(id);
    // if ( !existeAnuncio ) {
    //     throw new Error(`El ${id} no pertenece a ningun anuncio`);
    // }

    const anuncio = await Anuncio.findByIdAndUpdate(id, data);

    res.json({
        msg: 'put API - usuariosPut',
        anuncio
    });
}

const anunciosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const anunciosDelete = async(req, res = response) => {
    
    const { id } = req.params;
    
    // const existeAnuncio = await Anuncio.findById(id);
    // if ( !existeAnuncio ) {
    //     throw new Error(`El ${id} no pertenece a ningun anuncio`);
    // }

    const anuncioBorrado = await Anuncio.findByIdAndDelete( id );

    res.json( anuncioBorrado );

}

const anunciosGetId = async(req, res = response ) => {

    const { id } = req.params;
    const anuncio = await Anuncio.findById( id )

    res.json( anuncio );
}



module.exports = {
    anunciosGet,
    anunciosPost,
    anunciosPut,
    anunciosPatch,
    anunciosDelete,
    anunciosGetId
}