const express = require ('express');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware para parsing de parâmetros de consulta
app.use(express.json());

// Configuração personalizada do morgan para incluir o IP do cliente
morgan.format('custom', ':remote-addr :method :url :status :response-time ms');
app.use(morgan('custom')); // Usa o formato personalizado para o log


app.get('/inicio', (req, res, next) => {
    try {
        const { name } = req.query;

        // Verifica se o nome está presente
        if (!name || name.trim() === '') {
            throw new Error('Parâmetros insuficientes!');
        }

        const result = name.trim();
        res.json({ alerta: "Parâmetro válido", result });
    } catch (error) {
        next(error); // Passa o erro para o middleware de tratamento
    }
});

// Rota do jogo
app.get('/jogo', async (req, res, next) => {
    try {
        name = `/inicio?name=${name}`;
        const { name,nomesAleatorios} = req.query;
        

        // Verifica se o parâmetro 'name' foi passado
        if (!name || name.trim() === '') {
            throw new Error('Parâmetros insuficientes!');
        }


        // Função para obter a lista de Pokémon
        async function listaPokemon() {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
                return response.data.results;
            } catch (error) {
                throw new Error('Erro ao obter a lista de nomes dos Pokémons!');
            }
        }

        // Função para obter um Pokémon aleatório
        async function pokemonAleatorio() {
            const lista = await listaPokemon(); // Aguarda a lista de Pokémon
            const pokemonA = lista[Math.floor(Math.random() * lista.length)]; // Seleciona um Pokémon aleatório
            try {
                const response = await axios.get(pokemonA.url);
                return response.data; // Retorna os dados do Pokémon aleatório
            } catch (error) {
                throw new Error('Erro ao obter Pokémon aleatório!');
            }
        }

        // Função para gerar 3 nomes de Pokémon aleatórios (inclui o nome correto)
        async function nomesAleatorio() {
            const lista = await listaPokemon(); // Aguarda a lista de Pokémon
            const nPokemon2 = lista[Math.floor(Math.random() * lista.length)].name;
            const nPokemon3 = lista[Math.floor(Math.random() * lista.length)].name;
            const nPokemon4 = lista[Math.floor(Math.random() * lista.length)].name;
            return [nPokemon2, nPokemon3, nPokemon4];
        }

        // Obtém as informações do Pokémon aleatório e os nomes aleatórios
        const pokemonInfo = await pokemonAleatorio();
        nomesAleatorios = await nomesAleatorio();

        async function imagenPokemon() {
            const imagen = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonInfo}`)
            try {
                const imagenP = await axios.get(imagen.url);
                return response.data; // Retorna a imagem do Pokémon aleatório
            } catch (error) {
                throw new Error('Erro em obter a imagen do Pokémon aleatório!');
            }
            return[imagen];
        }

        const nameP1 = pokemonInfo.name.toLowerCase(); // Nome correto do Pokémon
        const [nameP2, nameP3, nameP4] = nomesAleatorios.map(n => n.toLowerCase()); // Outros nomes aleatórios
        const imagenP = await imagenPokemon();


        let qtdAcertos = 0;
        let qtdErros = 0;
        
            
        if (nameP1 === nameP1) {
            qtdAcertos += 1;
        } else {
            qtdErros += 1;
        }
        
        
      

        // Responde com os resultados do jogo
        res.json({
            name,
            imagenP,
            qtdAcertos,
            qtdErros,
            nomesAleatorios: [nameP1, nameP2, nameP3, nameP4] // Retorna os nomes aleatórios
        });

    } catch (error) {
        next(error); // Passa o erro para o middleware de tratamento
    }
});

// Rota do jogo
app.get('/resultado', async (req, res, next) => {
    try {
        name = `/inicio?name=${name}`;
        const { name} = req.query;
       

        // Verifica se o parâmetro 'name' foi passado
        if (!name || name.trim() === '') {
            throw new Error('Parâmetros insuficientes!');
        }

        

       const qtdAcertos = `/jogo?${res.json = qtdAcertos}`;
       const qtdErros = `/jogo?${res.json = qtdErros}`;
        
        
      

        // Responde com os resultados do jogo
        res.json({
            qtdAcertos,
            qtdErros,
        });

    } catch (error) {
        next(error); // Passa o erro para o middleware de tratamento
    }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack); // Log do erro
    res.status(400).json({ error: err.message }); // Responde com a mensagem de erro
});

app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});