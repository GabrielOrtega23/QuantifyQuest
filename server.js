const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const WebSocket = require('ws');

console.log("✅ Servidor está sendo iniciado...");

// Configure to serve static files
app.use(express.static(__dirname));

// Main route - serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Create WebSocket server
const wss = new WebSocket.Server({ server: http });

// Game rooms
const rooms = {};

// Questions database
const questionsDB = [
    {
        question: "I don't have _____ money left.",
        options: ["some", "any", "many", "much"],
        correct: 1,
        explanation: "Use 'any' in negative statements.",
        translation: "Eu não tenho dinheiro restante."
    },
    {
        question: "How _____ students are in your class?",
        options: ["much", "many", "few", "little"],
        correct: 1,
        explanation: "Use 'many' with countable nouns in questions.",
        translation: "Quantos estudantes tem na sua turma?"
    },
    {
        question: "I don't have _____ money left.",
        options: ["some", "any", "many", "much"],
        correct: 1,
        explanation: "Use 'any' in negative statements. 'Any' is used with both countable and uncountable nouns in negative sentences.",
        translation: "Eu não tenho dinheiro restante."
    },
    {
        question: "How _____ students are in your class?",
        options: ["much", "many", "few", "little"],
        correct: 1,
        explanation: "Use 'many' with countable nouns in questions. Students are countable, so we use 'many'.",
        translation: "Quantos estudantes tem na sua turma?"
    },
    {
question: "there isn't _____ milk in the fridge.",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "use 'any' in negative sentences with uncountable nouns like 'milk'.",
translation: "não há leite na geladeira."
},

{
question: "she has _____ friends in london.",
options: ["much", "any", "a few", "a little"],
correct: 2,
explanation: "'a few' is used with countable nouns ('friends') to indicate a small quantity.",
translation: "ela tem alguns amigos em londres."
},

{
question: "do you have _____ time to help me?",
options: ["some", "any", "many", "few"],
correct: 0,
explanation: "'some' is used in questions when offering or requesting something.",
translation: "você tem algum tempo para me ajudar?"
},

{
question: "there are too _____ people here.",
options: ["much", "many", "little", "any"],
correct: 1,
explanation: "'many' is used with countable nouns ('people').",
translation: "há muitas pessoas aqui."
},

{
question: "i need _____ water, please.",
options: ["any", "a few", "a little", "many"],
correct: 2,
explanation: "'a little' is used with uncountable nouns ('water') to indicate a small amount.",
translation: "eu preciso de um pouco de água, por favor."
},

{
question: "he doesn't have _____ patience for this.",
options: ["some", "any", "many", "few"],
correct: 1,
explanation: "'any' is used in negative sentences with uncountable nouns ('patience').",
translation: "ele não tem paciência para isso."
},

{
question: "we have _____ apples, but not many.",
options: ["some", "any", "much", "little"],
correct: 0,
explanation: "'some' indicates an unspecified quantity (countable nouns).",
translation: "temos algumas maçãs, mas não muitas."
},

{
question: "is there _____ sugar left?",
options: ["some", "any", "many", "few"],
correct: 1,
explanation: "'any' is used in questions with uncountable nouns ('sugar').",
translation: "ainda tem açúcar?"
},

{
question: "there's _____ traffic today.",
options: ["many", "any", "a lot of", "few"],
correct: 2,
explanation: "'a lot of' works with both countable and uncountable nouns ('traffic').",
translation: "tem muito trânsito hoje."
},

{
question: "she drank _____ coffee before work.",
options: ["a few", "a little", "many", "any"],
correct: 1,
explanation: "'a little' is used with uncountable nouns ('coffee').",
translation: "ela bebeu um pouco de café antes do trabalho."
},

{
question: "they didn't bring _____ food to the party.",
options: ["some", "any", "much", "a few"],
correct: 1,
explanation: "'any' is used in negative sentences with uncountable nouns ('food').",
translation: "eles não trouxeram comida para a festa."
},

{
question: "can i have _____ more tea?",
options: ["some", "any", "many", "few"],
correct: 0,
explanation: "'some' is used in requests (even in questions).",
translation: "posso tomar mais um pouco de chá?"
},

{
question: "there are _____ books on the shelf.",
options: ["a little", "any", "some", "much"],
correct: 2,
explanation: "'some' indicates an unspecified quantity (countable nouns).",
translation: "há alguns livros na prateleira."
},

{
question: "he has _____ money saved for his trip.",
options: ["a few", "a little", "many", "any"],
correct: 1,
explanation: "'a little' is used with uncountable nouns ('money').",
translation: "ele tem um pouco de dinheiro guardado para a viagem."
},

{
question: "are there _____ cookies left?",
options: ["some", "any", "much", "little"],
correct: 1,
explanation: "'any' is used in questions with plural countable nouns ('cookies').",
translation: "sobrou algum biscoito?"
},

{
question: "would you like _____ sugar in your coffee?",
options: ["some", "any", "many", "a few"],
correct: 0,
explanation: "'some' is used in offers and polite requests.",
translation: "você quer açúcar no seu café?"
},

{
question: "there aren't _____ chairs available.",
options: ["some", "any", "much", "a little"],
correct: 1,
explanation: "'any' is used in negative sentences with plural countable nouns.",
translation: "não há cadeiras disponíveis."
},

{
question: "she bought _____ new shoes yesterday.",
options: ["any", "some", "much", "a little"],
correct: 1,
explanation: "'some' indicates an unspecified quantity (countable nouns).",
translation: "ela comprou alguns sapatos novos ontem."
},

{
question: "do you need _____ help with your homework?",
options: ["some", "any", "many", "few"],
correct: 1,
explanation: "'any' is used in questions (uncountable nouns like 'help').",
translation: "você precisa de ajuda com seu dever de casa?"
},

{
question: "there's _____ butter in the fridge.",
options: ["a few", "a little", "many", "any"],
correct: 1,
explanation: "'a little' is used with uncountable nouns (e.g., 'butter').",
translation: "tem um pouco de manteiga na geladeira."
},

{
question: "he doesn't have _____ brothers or sisters.",
options: ["some", "any", "much", "a little"],
correct: 1,
explanation: "'any' is used in negative sentences with plural countable nouns.",
translation: "ele não tem irmãos ou irmãs."
},

{
question: "could you give me _____ paper, please?",
options: ["some", "any", "many", "few"],
correct: 0,
explanation: "'some' is used in polite requests (uncountable nouns).",
translation: "você poderia me dar um pouco de papel, por favor?"
},

{
question: "there were _____ people at the concert.",
options: ["a little", "any", "a lot of", "few"],
correct: 2,
explanation: "'a lot of' emphasizes a large quantity (countable/uncountable).",
translation: "havia muitas pessoas no show."
},

{
question: "i have _____ questions about the lesson.",
options: ["a few", "a little", "much", "any"],
correct: 0,
explanation: "'a few' is used with plural countable nouns (e.g., 'questions').",
translation: "tenho algumas perguntas sobre a aula."
},

{
question: "we don't have _____ time to waste.",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in negative sentences (uncountable nouns like 'time').",
translation: "não temos tempo a perder."
},

{
question: "she needs _____ more minutes to finish.",
options: ["some", "any", "much", "a little"],
correct: 0,
explanation: "'some' can modify plural countable nouns (e.g., 'minutes').",
translation: "ela precisa de mais alguns minutos para terminar."
},

{
question: "is there _____ cheese in the sandwich?",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in questions (uncountable nouns like 'cheese').",
translation: "tem queijo no sanduíche?"
},

{
question: "they ate _____ cookies after dinner.",
options: ["a little", "any", "some", "much"],
correct: 2,
explanation: "'some' indicates an unspecified quantity (countable nouns).",
translation: "eles comeram alguns biscoitos após o jantar."
},

{
question: "there isn't _____ noise outside today.",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in negative sentences (uncountable nouns like 'noise').",
translation: "não há barulho lá fora hoje."
},

{
question: "do you want _____ ice cream?",
options: ["some", "any", "many", "few"],
correct: 0,
explanation: "'some' is used in offers (uncountable nouns like 'ice cream').",
translation: "você quer um pouco de sorvete?"
},

{
question: "we need _____ eggs to make the cake.",
options: ["a little", "any", "some", "much"],
correct: 2,
explanation: "'some' is used with plural countable nouns (e.g., 'eggs') to indicate an unspecified quantity.",
translation: "precisamos de alguns ovos para fazer o bolo."
},

{
question: "there isn't _____ coffee left in the pot.",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in negative sentences with uncountable nouns (e.g., 'coffee').",
translation: "não há café restante na garrafa."
},

{
question: "would you like _____ milk with your cereal?",
options: ["any", "some", "many", "a few"],
correct: 1,
explanation: "'some' is used in offers (uncountable nouns like 'milk').",
translation: "você quer leite com seu cereal?"
},

{
question: "i have _____ important news to share.",
options: ["a few", "a little", "some", "any"],
correct: 2,
explanation: "'some' can be used with uncountable nouns (e.g., 'news') in positive statements.",
translation: "tenho algumas notícias importantes para compartilhar."
},

{
question: "there are _____ beautiful flowers in the garden.",
options: ["any", "some", "much", "a little"],
correct: 1,
explanation: "'some' indicates an unspecified quantity of countable nouns (e.g., 'flowers').",
translation: "há algumas flores bonitas no jardim."
},

{
question: "do you have _____ plans for the weekend?",
options: ["some", "any", "many", "a little"],
correct: 1,
explanation: "'any' is used in questions with plural countable nouns (e.g., 'plans').",
translation: "você tem planos para o fim de semana?"
},

{
question: "she added _____ salt to the soup.",
options: ["a few", "a little", "any", "many"],
correct: 1,
explanation: "'a little' is used with uncountable nouns (e.g., 'salt') to indicate a small amount.",
translation: "ela adicionou um pouco de sal na sopa."
},

{
question: "we don't have _____ information about the case.",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in negative sentences with uncountable nouns (e.g., 'information').",
translation: "não temos informações sobre o caso."
},

{
question: "could you lend me _____ money until tomorrow?",
options: ["some", "any", "much", "a few"],
correct: 0,
explanation: "'some' is used in requests (uncountable nouns like 'money').",
translation: "você poderia me emprestar algum dinheiro até amanhã?"
},

{
question: "there were _____ students absent today.",
options: ["a little", "any", "some", "much"],
correct: 2,
explanation: "'some' indicates an unspecified number of countable nouns (e.g., 'students').",
translation: "houve alguns alunos ausentes hoje."
},
{
question: "i'd like to buy _____ new clothes for summer.",
options: ["some", "any", "much", "few"],
correct: 0,
explanation: "'some' is used with plural countable nouns ('clothes') in positive statements.",
translation: "eu gostaria de comprar algumas roupas novas para o verão."
},

{
question: "there isn't _____ juice in the glass.",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in negative sentences with uncountable nouns ('juice').",
translation: "não há suco no copo."
},

{
question: "do we have _____ bread for breakfast?",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in questions with uncountable nouns ('bread').",
translation: "temos pão para o café da manhã?"
},

{
question: "she put _____ sugar in her tea.",
options: ["a few", "a little", "any", "many"],
correct: 1,
explanation: "'a little' is used with uncountable nouns ('sugar') for small quantities.",
translation: "ela colocou um pouco de açúcar no chá."
},

{
question: "we saw _____ deer in the forest yesterday.",
options: ["some", "any", "much", "a little"],
correct: 0,
explanation: "'some' is used with plural countable nouns ('deer') in positive statements.",
translation: "vimos alguns cervos na floresta ontem."
},

{
question: "there aren't _____ good restaurants in this area.",
options: ["some", "any", "much", "a little"],
correct: 1,
explanation: "'any' is used in negative sentences with plural countable nouns ('restaurants').",
translation: "não há bons restaurantes nesta área."
},

{
question: "could i have _____ more coffee, please?",
options: ["some", "any", "many", "few"],
correct: 0,
explanation: "'some' is used in polite requests (uncountable nouns like 'coffee').",
translation: "eu poderia tomar mais um pouco de café, por favor?"
},

{
question: "there's _____ sand in my shoes.",
options: ["a few", "a little", "any", "many"],
correct: 1,
explanation: "'a little' is used with uncountable nouns ('sand') for small amounts.",
translation: "tem um pouco de areia nos meus sapatos."
},

{
question: "do you know _____ good jokes?",
options: ["some", "any", "much", "a little"],
correct: 1,
explanation: "'any' is used in questions with plural countable nouns ('jokes').",
translation: "você conhece alguma piada boa?"
},

{
question: "i need to find _____ information about hotels.",
options: ["some", "any", "many", "few"],
correct: 0,
explanation: "'some' is used with uncountable nouns ('information') in positive statements.",
translation: "preciso encontrar algumas informações sobre hotéis."
},

{
question: "there wasn't _____ wind yesterday.",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in negative sentences with uncountable nouns ('wind').",
translation: "não havia vento ontem."
},

{
question: "would you like _____ help with your bags?",
options: ["some", "any", "many", "few"],
correct: 0,
explanation: "'some' is used in offers (uncountable nouns like 'help').",
translation: "você gostaria de ajuda com suas malas?"
},

{
question: "we have _____ oranges in the fridge.",
options: ["a little", "any", "some", "much"],
correct: 2,
explanation: "'some' indicates an unspecified quantity of countable nouns ('oranges').",
translation: "temos algumas laranjas na geladeira."
},

{
question: "there isn't _____ furniture in this room.",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in negative sentences with uncountable nouns ('furniture').",
translation: "não há móveis neste quarto."
},

{
question: "can you give me _____ advice about this?",
options: ["some", "any", "many", "a few"],
correct: 0,
explanation: "'some' is used with uncountable nouns ('advice') in requests.",
translation: "você pode me dar algum conselho sobre isso?"
},

{
question: "i don't have _____ experience in this field.",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in negative sentences with uncountable nouns ('experience').",
translation: "não tenho experiência neste campo."
},

{
question: "there are _____ children playing in the park.",
options: ["a little", "any", "some", "much"],
correct: 2,
explanation: "'some' indicates an unspecified number of countable nouns ('children').",
translation: "há algumas crianças brincando no parque."
},

{
question: "we didn't buy _____ vegetables at the market.",
options: ["some", "any", "much", "a little"],
correct: 1,
explanation: "'any' is used in negative sentences with plural countable nouns ('vegetables').",
translation: "não compramos vegetais no mercado."
},

{
question: "could you bring me _____ water, please?",
options: ["some", "any", "many", "few"],
correct: 0,
explanation: "'some' is used in polite requests (uncountable nouns like 'water').",
translation: "você poderia me trazer um pouco de água, por favor?"
},

{
question: "there's _____ rice left in the pot.",
options: ["a few", "a little", "any", "many"],
correct: 1,
explanation: "'a little' is used with uncountable nouns ('rice') for small amounts.",
translation: "tem um pouco de arroz restante na panela."
},
{
question: "there were _____ people at the concert.",
options: ["a little", "any", "a lot of", "few"],
correct: 2,
explanation: "'a lot of' emphasizes a large quantity (countable/uncountable).",
translation: "havia muitas pessoas no show."
},

{
question: "i have _____ questions about the lesson.",
options: ["a few", "a little", "much", "any"],
correct: 0,
explanation: "'a few' is used with plural countable nouns (e.g., 'questions').",
translation: "tenho algumas perguntas sobre a aula."
},

{
question: "we don't have _____ time to waste.",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in negative sentences (uncountable nouns like 'time').",
translation: "não temos tempo a perder."
},

{
question: "she needs _____ more minutes to finish.",
options: ["some", "any", "much", "a little"],
correct: 0,
explanation: "'some' can modify plural countable nouns (e.g., 'minutes').",
translation: "ela precisa de mais alguns minutos para terminar."
},

{
question: "is there _____ cheese in the sandwich?",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in questions (uncountable nouns like 'cheese').",
translation: "tem queijo no sanduíche?"
},

{
question: "they ate _____ cookies after dinner.",
options: ["a little", "any", "some", "much"],
correct: 2,
explanation: "'some' indicates an unspecified quantity (countable nouns).",
translation: "eles comeram alguns biscoitos após o jantar."
},

{
question: "there isn't _____ noise outside today.",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in negative sentences (uncountable nouns like 'noise').",
translation: "não há barulho lá fora hoje."
},

{
question: "do you want _____ ice cream?",
options: ["some", "any", "many", "few"],
correct: 0,
explanation: "'some' is used in offers (uncountable nouns like 'ice cream').",
translation: "você quer um pouco de sorvete?"
},

{
question: "we need _____ eggs to make the cake.",
options: ["a little", "any", "some", "much"],
correct: 2,
explanation: "'some' is used with plural countable nouns (e.g., 'eggs') to indicate an unspecified quantity.",
translation: "precisamos de alguns ovos para fazer o bolo."
},

{
question: "there isn't _____ coffee left in the pot.",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in negative sentences with uncountable nouns (e.g., 'coffee').",
translation: "não há café restante na garrafa."
},

{
question: "would you like _____ milk with your cereal?",
options: ["any", "some", "many", "a few"],
correct: 1,
explanation: "'some' is used in offers (uncountable nouns like 'milk').",
translation: "você quer leite com seu cereal?"
},

{
question: "i have _____ important news to share.",
options: ["a few", "a little", "some", "any"],
correct: 2,
explanation: "'some' can be used with uncountable nouns (e.g., 'news') in positive statements.",
translation: "tenho algumas notícias importantes para compartilhar."
},

{
question: "there are _____ beautiful flowers in the garden.",
options: ["any", "some", "much", "a little"],
correct: 1,
explanation: "'some' indicates an unspecified quantity of countable nouns (e.g., 'flowers').",
translation: "há algumas flores bonitas no jardim."
},

{
question: "do you have _____ plans for the weekend?",
options: ["some", "any", "many", "a little"],
correct: 1,
explanation: "'any' is used in questions with plural countable nouns (e.g., 'plans').",
translation: "você tem planos para o fim de semana?"
},

{
question: "she added _____ salt to the soup.",
options: ["a few", "a little", "any", "many"],
correct: 1,
explanation: "'a little' is used with uncountable nouns (e.g., 'salt') to indicate a small amount.",
translation: "ela adicionou um pouco de sal na sopa."
},

{
question: "we don't have _____ information about the case.",
options: ["some", "any", "many", "a few"],
correct: 1,
explanation: "'any' is used in negative sentences with uncountable nouns (e.g., 'information').",
translation: "não temos informações sobre o caso."
},

{
question: "could you lend me _____ money until tomorrow?",
options: ["some", "any", "much", "a few"],
correct: 0,
explanation: "'some' is used in requests (uncountable nouns like 'money').",
translation: "você poderia me emprestar algum dinheiro até amanhã?"
},

{
question: "there were _____ students absent today.",
options: ["a little", "any", "some", "much"],
correct: 2,
explanation: "'some' indicates an unspecified number of countable nouns (e.g., 'students').",
translation: "houve alguns alunos ausentes hoje."
},

    // ... (adicionar todas as outras perguntas aqui)
];

wss.on('connection', (ws) => {
    console.log('🎮 New client connected');
    
    let currentRoom = null;
    let username = null;
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleMessage(ws, data);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    
    ws.on('close', () => {
        console.log(`🚪 Client disconnected: ${username}`);
        if (currentRoom && rooms[currentRoom] && username) {
            handleLeaveRoom(ws, currentRoom, username);
        }
    });
    
    function handleMessage(ws, data) {
        switch(data.type) {
            case 'create_room':
                handleCreateRoom(ws, data);
                break;
            case 'join_room':
                handleJoinRoom(ws, data);
                break;
            case 'leave_room':
                handleLeaveRoom(ws, data.roomCode, data.username);
                break;
            case 'start_game':
                handleStartGame(data.roomCode);
                break;
            case 'submit_answer':
                handleSubmitAnswer(data);
                break;
            case 'next_question':
                handleNextQuestion(data.roomCode);
                break;
        }
    }
    
    function handleCreateRoom(ws, data) {
        const roomCode = data.roomCode;
        username = data.username;
        
        rooms[roomCode] = {
            host: ws,
            players: [{
                ws,
                username,
                score: 0
            }],
            gameState: 'waiting',
            currentQuestion: 0,
            questions: []
        };
        
        currentRoom = roomCode;
        
        ws.send(JSON.stringify({
            type: 'room_created',
            roomCode,
            players: rooms[roomCode].players.map(p => ({
                username: p.username,
                score: p.score
            }))
        }));
        
        console.log(`🏠 Room created: ${roomCode} by ${username}`);
    }
    
    function handleJoinRoom(ws, data) {
        const roomCode = data.roomCode;
        username = data.username;
        
        if (!rooms[roomCode]) {
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Room does not exist'
            }));
            return;
        }
        
        if (rooms[roomCode].players.some(p => p.username === username)) {
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Username already taken in this room'
            }));
            return;
        }
        
        rooms[roomCode].players.push({
            ws,
            username,
            score: 0
        });
        
        currentRoom = roomCode;
        
        broadcastToRoom(roomCode, {
            type: 'player_joined',
            username,
            players: rooms[roomCode].players.map(p => ({
                username: p.username,
                score: p.score
            }))
        });
        
        console.log(`👋 ${username} joined room ${roomCode}`);
    }
    
    function handleLeaveRoom(ws, roomCode, username) {
        if (!rooms[roomCode]) return;
        
        rooms[roomCode].players = rooms[roomCode].players.filter(p => p.username !== username);
        
        if (rooms[roomCode].host === ws) {
            if (rooms[roomCode].players.length > 0) {
                rooms[roomCode].host = rooms[roomCode].players[0].ws;
            } else {
                delete rooms[roomCode];
                console.log(`🚮 Room ${roomCode} deleted (no players left)`);
                return;
            }
        }
        
        broadcastToRoom(roomCode, {
            type: 'player_left',
            username,
            players: rooms[roomCode].players.map(p => ({
                username: p.username,
                score: p.score
            }))
        });
    }
    
    function handleStartGame(roomCode) {
        if (!rooms[roomCode]) return;
        
        rooms[roomCode].questions = shuffleArray(questionsDB).slice(0, 10);
        rooms[roomCode].gameState = 'playing';
        rooms[roomCode].currentQuestion = 0;
        
        rooms[roomCode].players.forEach(player => {
            player.score = 0;
        });
        
        broadcastToRoom(roomCode, {
            type: 'game_started',
            questions: rooms[roomCode].questions
        });
        
        sendQuestion(roomCode);
    }
    
    function sendQuestion(roomCode) {
        const room = rooms[roomCode];
        if (!room || room.currentQuestion >= room.questions.length) {
            endGame(roomCode);
            return;
        }
        
        broadcastToRoom(roomCode, {
            type: 'question_update',
            questionIndex: room.currentQuestion,
            question: room.questions[room.currentQuestion]
        });
        
        startQuestionTimer(roomCode);
    }
    
    function handleSubmitAnswer(data) {
        const roomCode = data.roomCode;
        const room = rooms[roomCode];
        if (!room || room.gameState !== 'playing') return;
        
        const player = room.players.find(p => p.username === data.username);
        if (!player) return;
        
        if (data.isCorrect) {
            player.score += 1;
        }
        
        broadcastToRoom(roomCode, {
            type: 'answer_result',
            username: data.username,
            isCorrect: data.isCorrect,
            players: room.players.map(p => ({
                username: p.username,
                score: p.score
            }))
        });
    }
    
    function handleNextQuestion(roomCode) {
        const room = rooms[roomCode];
        if (!room || room.gameState !== 'playing') return;
        
        room.currentQuestion++;
        sendQuestion(roomCode);
    }
    
    function startQuestionTimer(roomCode) {
        const room = rooms[roomCode];
        if (!room) return;
        
        let timeLeft = 15;
        
        const timer = setInterval(() => {
            timeLeft--;
            
            broadcastToRoom(roomCode, {
                type: 'timer_update',
                timeLeft
            });
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                handleNextQuestion(roomCode);
            }
        }, 1000);
    }
    
    function endGame(roomCode) {
        const room = rooms[roomCode];
        if (!room) return;
        
        const results = room.players.map(p => ({
            username: p.username,
            score: p.score
        }));
        
        broadcastToRoom(roomCode, {
            type: 'game_ended',
            results: results
        });
        
        room.gameState = 'waiting';
        room.currentQuestion = 0;
        room.questions = [];
    }
    
    function broadcastToRoom(roomCode, message) {
        if (!rooms[roomCode]) return;
        
        rooms[roomCode].players.forEach(player => {
            if (player.ws.readyState === WebSocket.OPEN) {
                player.ws.send(JSON.stringify(message));
            }
        });
    }
    
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
});
const io = require('socket.io')(server, {
    transports: ['websocket', 'polling'],
    cors: {
      origin: process.env.CLIENT_URL || "https://seusite.onrender.com",
      credentials: true
    }
  });

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});