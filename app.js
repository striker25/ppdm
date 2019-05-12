const express = require('express')
const consultarProducto = require('./gestion/consultarProducto');
const consultarCliente = require('./gestion/consultarCliente');

const app = express()
const port = process.env.PORT || 5000;

// cargar productos al iniciar el servidor
let productos = consultarProducto.getProduct();

// cargar los clientes al inicar el servidor
let clientes = consultarCliente.getClient();



/*###################### PARTE DE LOS PRODUCTOS ################################*/
/**
 * obtener todos los productos
 * ejemplo:
 * http://localhost:5000/producto 
 */
app.get('/productos', (req, res) => {
    res.send(productos);

    //refrescar productos
    //productos = consultarProducto.getProduct();
});

/**
 * Para realizar la busqueda por id de un solo elemento:
 * http://localhost:5000/obtener-producto?id=id_producto, 
 * 
 * por barcode:
 * http://localhost:5000/obtener-producto?barcode=barcode_producto
 * 
 * por precio: 
 * http://localhost:5000/obtener-producto?precio=precio_producto, 
 * 
 * donde:
 *  id_producto, barcode_producto, precio_producto es el valor que se le 
 *  pasa al servidor para que realice la busqueda 
 */

app.get('/obtener-producto', (req, res) => {

    let productoEncontrado = [];
    productos.forEach(producto => {
        // buscar id de elemento en la base de datos

        if (req.query.id != undefined && producto.id_producto == req.query.id) {
            productoEncontrado.push(producto);
        }

        if (req.query.barcode != undefined && producto.barcode == req.query.barcode) {

            productoEncontrado.push(producto);
        }

        if (req.query.precio != undefined && producto.precio == req.query.precio) {
            productoEncontrado.push(producto);
        }

        console.log(req.query.barcode);
    });

    if (productoEncontrado.length == 0 || productoEncontrado == undefined)
        productoEncontrado.push("No se ha encontado ningun producto que coincida con ese criterio.");

    res.send(productoEncontrado);
});




/**
 * No es necesario proporcionar el id del producto ya que es autoincrementable, ejemplo:
 * http://localhost:5000/agregar-producto?barcode=123&descripcion=producto%20magico&precio=394&imagen=/c/usersdsd_
 * 
 * Si se desea se puede omitir la imagen, ejemplo:
 * http://localhost:5000/agregar-producto?barcode=123&descripcion=producto%20magico&precio=394
 * 
 * el servidor considera que no se le quizo proporcionar ninguna y asigna una ruta predeterminada para
 * la imagen
 */
app.get('/agregar-producto', (req, res) => {
    let producto = {
        barcode: req.query.barcode,
        descripcion: req.query.descripcion,
        precio: req.query.precio,
        imagen: req.query.imagen
    }

    if (!(producto.barcode == undefined) != 0 && !(producto.precio != undefined)) {
        if (producto.imagen == undefined)
            producto.imagen = "/img/productos/producto-no-disponible.jpg";

        // agregar producto a BD SQLite
        consultarProducto.addProduct(
            producto.barcode,
            producto.descripcion,
            producto.precio,
            producto.imagen
        );

        res.send("Producto agregado.");

        // actualizar lista de productos
        productos = consultarProducto.getProduct();
    } else {
        res.send("Campos incompletos, revise y corrija.");
    }
});

/**
 * Para eliminar productos, solo mediante id, ejemplo: 
 * http://localhost:5000/eliminar-producto?id=2675
 */
app.get('/eliminar-producto', (req, res) => {
    let id = req.query.id;

    res.send(consultarProducto.deleteProduct(id));

    productos = consultarProducto.getProduct();
});


/*###################### PARTE DE LOS CLIENTES ################################*/
/**
 * obtener todos los clientes
 * ejemplo:
 * http://localhost:5000/cliente 
 */
app.get('/clientes', (req, res) => {
    res.send(clientes);

    //refrescar productos
    //productos = consultarProducto.getProduct();
});

/**
 * Para realizar la busqueda por id de un solo elemento:
 * http://localhost:5000/obtener-cliente?id=id_cliente, 
 * 
 * por barcode:
 * http://localhost:5000/obtener-cliente?nombre=nombre_cliente 
 * 
 * donde:
 *  id_cliente, nombre_cliente es el valor que se le 
 *  pasa al servidor para que realice la busqueda 
 */

app.get('/obtener-cliente', (req, res) => {

    let clienteEncontrado = [];
    clientes.forEach(cliente => {
        // buscar id de elemento en la base de datos

        if (req.query.id != undefined && cliente.id == req.query.id) {
            clienteEncontrado.push(cliente);
        }

        if (req.query.nombre != undefined && cliente.nombre == req.query.nombre) {

            clienteEncontrado.push(cliente);
        }

        console.log(req.query.barcode);
    });

    if (clienteEncontrado.length == 0 || clienteEncontrado == undefined)
        clienteEncontrado.push("No se ha encontado ningun cliente que coincida con ese criterio.");

    res.send(clienteEncontrado);
});


/**
 * No es necesario proporcionar el id del cliente ya que es autoincrementable, ejemplo:
 * http://localhost:5000/agregar-cliente?nombre=juan perez&direccion=no se donde vive&telefono=394
 */
app.get('/agregar-cliente', (req, res) => {
    let cliente = {
        id: null,
        nombre: req.query.nombre,
        direccion: req.query.direccion,
        telefono: req.query.telefono
    }

    if (!(cliente.nombre == undefined) != 0) { 

        // agregar cliente a BD SQLite
        consultarProducto.addProduct(
            cliente.id,
            cliente.nombre,
            cliente.direccion,
            cliente.telefono
        );

        res.send("Cliente agregado.");

        // actualizar lista de clientes
        clientes = consultarCliente.getClient();
    } else {
        res.send("Campos incompletos, revise y corrija.");
    }
});

/**
 * Para eliminar productos, solo mediante id, ejemplo: 
 * http://localhost:5000/eliminar-cliente?id=2675
 */
app.get('/eliminar-cliente', (req, res) => {
    let id = req.query.id;

    res.send(consultarCliente.deleteClient(id));

    // actualizar lista de clientes
    clientes = consultarCliente.getClient();
});











/**
 * POST TESTS
 */

app.post('/productos:id', (req, res) => {
    res.send('user ' + req.params.id);
});

app.listen(port, () => console.log(`Servidor a la escucha en el puerto: ${port}`))