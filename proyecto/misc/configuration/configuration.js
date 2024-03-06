export default {
    dataSource : "db",
    db : {
        user : "usermongo",
        pass : "mongo938",
        dbname : "ecommerce",
        server : "cluster0.wtewrgc.mongodb.net"
    },
    fs : { 
        products : {
            path : './data/',
            filename : 'productos.json'
        },
        carts : {
            path : './data/',
            filename : 'carrito.json'
        },    
    },
    queries : {
        products : {
            limit : 10,
            page: 1
        }
    },
    httpServer : {
        port : 8080,
        sessionSecret : '123456'
    },
    viewengine : {
        name : "handlebars"
    },
    hashing : {
        saltRounds : 10
    }
}
