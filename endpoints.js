var mysql = require('mysql');
var tools = require('./tools');
var validation = new tools();
var con = mysql.createConnection({
    host: process.env.LOCALHOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = function (app) {

    // CEP
    app.get('/cep/:cep', function(req, res) {
        if(validation.isEmpty(req.params.cep)){
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json({ "result": "CEP nulo." }); 
        }
        let cep = validation.allCEPReplacements(req.params.cep);
        if(!validation.isCEPValid(cep)){
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json({ "result": "CEP inválido." });
        }
        let query = 
        `SELECT ES.nome AS estado, ES.sigla AS uf, CI.nome AS cidade, CE.endereco,   
            (CASE WHEN (SELECT complemento_endereco FROM cep WHERE cep=?) IS NOT NULL 
                THEN (SELECT complemento_endereco FROM cep WHERE cep=?) 
            END) AS complemento_endereco, CE.bairro
        FROM cep AS CE, estados AS ES, cidades AS CI
        WHERE CE.cep=? AND CI.uuid=CE.id_cidade AND ES.id=CE.id_estado`;
        con.query(query, [cep, cep, cep], function (err, result) {
            if (err || result.length == 0) return res.json({ "result": "CEP não encontrado." });
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json(result);
        });
    });

    // Lista cidades
    app.get('/listacidades/:numero/:valor', function(req, res) { 
        if(validation.isEmpty(req.params.numero) || validation.isEmpty(req.params.valor) || !validation.isNumeric(req.params.numero)){
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json({ "result": "Valor(es) nulo." });
        }
        let numero = parseInt(req.params.numero); // Número de cidades listadas na requisição
        if(numero > 5){
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json({ "result": "O número máximo para listagem é 5." });
        }
        let query = `SELECT nome AS cidade FROM cidades WHERE nome LIKE ? LIMIT ?`;
        con.query(query, [req.params.valor+'%', numero], function (err, result) {
            if (err || result.length == 0) return res.json({ "result": "Nenhuma cidade encontrada." });
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json(result);
        });
    });

    // Lista UF
    app.get('/listauf', function(req, res) { 
        let query = `SELECT sigla AS uf FROM estados`;
        con.query(query, [], function (err, result) {
            if (err || result.length == 0) return res.json({ "result": "Nenhuma UF encontrada." });
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json(result);
        });
    });

    // Lista todos estados
    app.get('/listatodosestados', function(req, res) { 
        let query = `SELECT nome AS estado, sigla FROM estados`;
        con.query(query, [], function (err, result) {
            if (err || result.length == 0) return res.json({ "result": "Nenhuma estado/UF encontrado." });
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json(result);
        });
    });

    // Lista estados
    app.get('/listaestados/:numero/:valor', function(req, res) { 
        if(validation.isEmpty(req.params.numero) || validation.isEmpty(req.params.valor) || !validation.isNumeric(req.params.numero)){
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json({ "result": "Valor(es) nulo." });
        }
        let numero = parseInt(req.params.numero); // Número de cidades listadas na requisição
        if(numero > 5){
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json({ "result": "O número máximo para listagem é 5." });
        }
        let query = `SELECT nome AS estado, sigla FROM estados WHERE nome LIKE ? LIMIT ?`;
        con.query(query, [req.params.valor+'%', numero], function (err, result) {
            if (err || result.length == 0) return res.json({ "result": "Nenhuma estado/UF encontrado." });
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json(result);
        });
    });

    // Lista bairros
    app.get('/listabairros/:numero/:valor', function(req, res) { 
        if(validation.isEmpty(req.params.numero) || validation.isEmpty(req.params.valor) || !validation.isNumeric(req.params.numero)){
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json({ "result": "Valor(es) nulo." });
        }
        let numero = parseInt(req.params.numero); // Número de cidades listadas na requisição
        if(numero > 5){
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json({ "result": "O número máximo para listagem é 5." });
        }
        let query = `SELECT CE.bairro, CI.nome AS cidade, ES.nome AS estado, ES.sigla AS uf 
        FROM cep AS CE, estados AS ES, cidades AS CI 
        WHERE bairro LIKE ? AND CI.uuid=CE.id_cidade AND ES.id=CE.id_estado GROUP BY CE.id_cidade LIMIT ?`;
        con.query(query, [req.params.valor+'%', numero], function (err, result) {
            if (err || result.length == 0) return res.json({ "result": "Nenhum bairro encontrado." });
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json(result);
        });
    });

    // Lista rua
    app.get('/listarua/:numero/:valor', function(req, res) { 
        if(validation.isEmpty(req.params.numero) || validation.isEmpty(req.params.valor) || !validation.isNumeric(req.params.numero)){
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json({ "result": "Valor(es) nulo." });
        }
        let numero = parseInt(req.params.numero); // Número de cidades listadas na requisição
        if(numero > 5){
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json({ "result": "O número máximo para listagem é 5." });
        }
        let query = `SELECT CE.endereco, CE.bairro, CI.nome AS cidade, ES.nome AS estado, ES.sigla AS uf 
        FROM cep AS CE, estados AS ES, cidades AS CI 
        WHERE endereco LIKE ? AND CI.uuid=CE.id_cidade AND ES.id=CE.id_estado GROUP BY CE.id_estado LIMIT ?`;
        con.query(query, ['%'+req.params.valor+'%', numero], function (err, result) {
            if (err || result.length == 0) return res.json({ "result": "Nenhuma rua encontrada." });
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.json(result);
        });
    });

}