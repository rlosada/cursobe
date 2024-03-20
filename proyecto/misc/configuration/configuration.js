export default {
    loginMode : 'JWT',
    jwtSecret : 'JWT_SECRET',
    jwtExpirationSeconds : 3600,
    cookieSecret : 'COOKIE_SECRET',
    dataSource : "db",
    db : {
        user : "USER",
        pass : "PASS",
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
    },
    githubPassportLogin : {
        clientid: "CLIENT_ID",
        clientsecret: "CLIENT_SECRET",
        callback: "CALLBACK"
    }
}
