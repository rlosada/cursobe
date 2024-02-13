export default {
    dataSource : "db",
    db : {
        user : "usermongo",
        pass : "passmongo",
        dbname : "ecommerce",
        server : "cluster0.wtewrgc.mongodb.net"
    },
    products : {
        path : './data/',
        filename : 'productos.json'
    },
    carts : {
        path : './data/',
        filename : 'carrito.json'
    },    
    httpServer : {
        port : 8080
    },
    viewengine : {
        name : "handlebars"
    }
}
