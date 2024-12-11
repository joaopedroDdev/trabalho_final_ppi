import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { table } from 'console';
const app = express();

app.use(session({
    secret: 'chave',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30 // 30 m 
    }
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'pages/public')));

const porta = 3002;
const host = '0.0.0.0';

var listaUsers = [];
var mensagens = [];

function menu(req, res) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (!dataHoraUltimoLogin){
        dataHoraUltimoLogin='';
    }
    res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu</title>
    <!-- Inclusão do Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEJ+Koa7J3v1p7q0y6gDtH5xT1df0Jw7V6j54Vdt1FQ7+P1m/tV1sJS7Kh6Yk" crossorigin="anonymous">
</head>
<body>

    <div class="container mt-5">
        <h1 class="text-center">Menu de Navegação</h1>

        <!-- Menu de navegação -->
        <div class="d-flex justify-content-center mt-4">
            <a href="/cadastrarUsuario" class="btn btn-primary mx-2">Cadastrar Usuário</a> <br>
            <a href="/batepapo" class="btn btn-success mx-2">Bate-Papo</a> <br>
            <a href="/logout" class="btn btn-danger mx-2">Logout</a> <br>
            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Seu último acesso foi realizado em ${dataHoraUltimoLogin}</a>
        </div>
    </div>

    <!-- Inclusão do Bootstrap JS e dependências -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz4fnFO9gybF2Jf2dX6iEnkA9L2r4zXk9PPlh1Orj58X4k6wFVgXI3b6M3" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js" integrity="sha384-pzjw8f+ua7Kw1TIq0UB7QkhIckGz3Kp7mbIm71ZL5K8C4B1sIyg5U9hSbcji9Qf6" crossorigin="anonymous"></script>

</body>
</html>

`);
}



function autenticarUsuario(req, resp) {
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    if (usuario === 'usuario' && senha === 'senha') {
        req.session.usuarioLogado = true;
        resp.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
        resp.redirect('/');
    }
    else {
        resp.send(`
                    <html>
                        <head>
                         <meta charset="utf-8">
                         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                               integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                        </head>
                        <body>
                            <div class="container w-25"> 
                                <div class="alert alert-danger" role="alert">
                                    Usuário ou senha inválidos!
                                </div>
                                <div>
                                    <a href="/login.html" class="btn btn-primary">Tentar novamente</a>
                                </div>
                            </div>
                        </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                                crossorigin="anonymous">
                        </script>
                    </html>
                  `
        );
    }
    resp.end();
}

function cadastrousuario(req, resp) {
    resp.send(`
            <html>
                <head>
                    <title>Cadastro de Usuarios</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                </head>
                <body>
                    <div class="container text-center">
                        <h1 class="mb-5">Cadastro de Usuarios</h1>
                        <form method="POST" action="/cadastrarUsuario" class="border p-3 row g-3" novalidate>
                            <div class="col-md-4">
                                <label for="nome" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="nome" name="nome"  placeholder="Digite seu nome:">
                             </div>
                             <div class="col-md-4">
                                <label for="apelido" class="form-label">Apelido</label>
                                <input type="text" class="form-control" id="apelido" name="apelido">
    
                             </div>
                             <div class="col-md-4">
                                <label for="data" class="form-label">Data de Nascimento</label>
                                 <input type="date" class="form-control" id="data" name="data">
                            </div>
                             <div class="col-12">
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                            </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </html>
    `);
    resp.end();
}

function cadastrarUsuario(req, resp) {
    const nome = req.body.nome;
    const apelido = req.body.apelido;
    const data = req.body.data;
    if (nome && apelido && data) {

        const user = { nome, apelido, data };
        listaUsers.push(user);
        resp.redirect('/listadeUsuarios');
    }
    else {
        resp.write(`
        <html>
            <head>
                <title>Cadastro de Usuarios</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <body>
                <div class="container text-center">
                    <h1 class="mb-5">Cadastro de Usuarios</h1>
                    <form method="POST" action="/cadastrarUsuario" class="border p-3 row g-3" novalidate>
                        <div class="col-md-4">
                            <label for="nome" class="form-label">Nome</label>
                             <input type="text" value="${nome}" class="form-control" id="nome" name="nome"  placeholder="Digite seu nome">
    `);
        if (!nome) {
            resp.write(`
            <p> Erro, digite o Nome</p>`);
        }
        resp.write(`
                         </div>
                         <div class="col-md-4">
                            <label for="apelido" class="form-label">Apelido</label>
                            <input type="text" value="${apelido}" class="form-control" id="apelido" name="apelido">
    `);
        if (!apelido) {
            resp.write(`
            <p>Erro, digite o apelido</p>`);
        }
        resp.write(`
                         </div>
                         <div class="col-md-4">
                            <label for="data" class="form-label">Data de Nascimento</label>
                             <input type="date" value="${data}" class="form-control" id="data" name="data">
    `);
        if (!data) {
            resp.write(`
            <p>Erro, digite a data</p>`);
        }
        resp.write(`             
                        </div>
                         <div class="col-12">
                            <button class="btn btn-primary" type="submit">Cadastrar</button>
                        </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
`);
    }
    resp.end();
}

function mostrarUsuarios(req, resp) {

    resp.write(`
        <html>
            <head>
                <title>Lista de Usuarios</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <meta charset="utf-8">
            </head>
            <body>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Apelido</th>
                        <th scope="col">Data de Nascimento</th>
                    </tr>
                </thead>
                <tbody>`);
    for (var i = 0; i < listaUsers.length; i++) {
        resp.write(`<tr>
                                            <td>${listaUsers[i].nome}</td>
                                            <td>${listaUsers[i].apelido}</td>
                                            <td>${listaUsers[i].data}</td>
                                        </tr>
                                        `);

    }
    resp.write(`</tbody> 
                    </table>
                    <a class="btn btn-primary" href="/cadastrarUsuario">Continuar Cadastrando</a>
                    <a class="btn btn-secondary" href="/">Voltar para o Menu</a>
                    </body>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
                </html>
                    `);
                    resp.end();
}

function batePapo(req, resp) {
    resp.write(`
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat System</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f4f4f4;
        }
        .chat-container {
            width: 90%;
            max-width: 600px;
            background: #fff;
            margin-top: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        .messages {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            height: 300px;
            overflow-y: auto;
            background-color: #fafafa;
        }
        .message {
            margin: 5px 0;
            padding: 8px;
            background: #e1f5fe;
            border-radius: 5px;
        }
        .form {
            margin-top: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        select, input[type="text"], button {
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            background: #007bff;
            color: white;
            cursor: pointer;
        }
        button:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <h2>Chat</h2>
        <div class="messages" id="messages">`);
        for(let i=0; i< mensagens.length;i++){
            resp.write(`
                    <div class="message">
                        <font style="vertical-align: inherit;">
                            <font style="vertical-align: inherit;">${mensagens[i].usuario}:${mensagens[i].mensagem}</font>
                        </font>
                    </div>
                `)            
        }
    resp.write(`</div>

        <form action="/batepapo" method="POST" class="form" id="chat-form">
            <select id="user-select" name="usuario">
                <option value="">Selecionar Usuario</option> `);    
                for(let i=0; i< listaUsers.length;i++){
                    resp.write(`
                            <option value ="${listaUsers[i].apelido}">
                            ${listaUsers[i].apelido}</option>
                                
                        `)            
                }         
           resp.write(` </select>
            <input type="text" id="message-input" name="mensagem" placeholder="Type your message here..." required>
            <button type="submit">Send</button>
        </form>
    </div>

</body>
</html>

 `)
 resp.end();
}

function mandarMensagem(req,resp){
    const mensagem = req.body.mensagem;
    const usuario = req.body.usuario;
    if (mensagem && usuario) {

        const msg = { mensagem, usuario };
        mensagens.push(msg);
        resp.redirect('/batepapo');
    }
    else {
        resp.write(`
            <!DOCTYPE html>
     <html lang="en">
     <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Chat System</title>
         <style>
             body {
                 font-family: Arial, sans-serif;
                 margin: 0;
                 padding: 0;
                 display: flex;
                 flex-direction: column;
                 align-items: center;
                 background-color: #f4f4f4;
             }
             .chat-container {
                 width: 90%;
                 max-width: 600px;
                 background: #fff;
                 margin-top: 20px;
                 border-radius: 8px;
                 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                 padding: 20px;
             }
             .messages {
                 border: 1px solid #ddd;
                 border-radius: 4px;
                 padding: 10px;
                 height: 300px;
                 overflow-y: auto;
                 background-color: #fafafa;
             }
             .message {
                 margin: 5px 0;
                 padding: 8px;
                 background: #e1f5fe;
                 border-radius: 5px;
             }
             .form {
                 margin-top: 15px;
                 display: flex;
                 flex-direction: column;
                 gap: 10px;
             }
             select, input[type="text"], button {
                 padding: 10px;
                 font-size: 16px;
                 border: 1px solid #ddd;
                 border-radius: 4px;
             }
             button {
                 background: #007bff;
                 color: white;
                 cursor: pointer;
             }
             button:hover {
                 background: #0056b3;
             }
         </style>
     </head>
     <body>
         <div class="chat-container">
             <h2>Chat</h2>
             <div class="messages" id="messages">`);
             for(let i=0; i< mensagens.length;i++){
                 resp.write(`
                         <div class="message">
                             <font style="vertical-align: inherit;">
                                 <font style="vertical-align: inherit;">${mensagens[i].usuario}:${mensagens[i].mensagem}</font>
                             </font>
                         </div>
                     `)            
             }
         resp.write(`</div>
     
             <form action="/batepapo" method="POST" class="form" id="chat-form">
                 <select id="user-select" name="user">
                     <option value="">Selecionar Usuario</option> `);    
                     for(let i=0; i< listaUsers.length;i++){
                         resp.write(`
                                  <option value ="${listaUsers[i].apelido}">
                                  ${listaUsers[i].apelido}</option>
                             `)            
                     }         
                resp.write(` </select>`);
                if (!usuario) {
                    resp.write(`<p>Erro, insira um usuario!</p>`);
                }
                resp.write(`
                 <input type="text" id="message-input" name="message" placeholder="Type your message here..." required>`);
                 if (!mensagem) {
                    resp.write(`<p>Erro, insira uma mensagem!</p>`);
                }
                 resp.write(`
                 <button type="submit">Send</button>
             </form>
         </div>
     
     </body>
     </html>
     
      `)
    }
    resp.end();
}

function verificarAutenticacao(req, resp, next){
    if (req.session.usuarioLogado){
        next(); //permita acessar os recursos solicitados
    }
    else
    {
        resp.redirect('/login.html');
    }
}

app.post('/login', autenticarUsuario);


app.get('/login', (req, res) => {
    res.redirect('login.html');

});

app.get(`/`,verificarAutenticacao, menu);

app.get('/cadastrarUsuario',verificarAutenticacao, cadastrousuario);

app.post('/cadastrarUsuario', verificarAutenticacao, cadastrarUsuario);

app.get('/listadeUsuarios',verificarAutenticacao,  mostrarUsuarios);

app.get('/batepapo', verificarAutenticacao, batePapo);

app.post('/batepapo',verificarAutenticacao, mandarMensagem);

app.get('/logout', (req, resp) => {
    req.session.destroy(); 
    resp.redirect('/login.html');
});

app.listen(porta, host, () => {
    console.log(`Rodando ok http://${host}:${porta}`)
});