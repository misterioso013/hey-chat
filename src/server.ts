import express from 'express';
import path from 'path';
import http from 'http';
import { Server} from 'socket.io';
import ejs from 'ejs';

type Message = {
    author: string;
    message: string;
}

const app = express();
const server = http.createServer(app);
const io =  new Server(server);

app.use(express.static(path.join(__dirname, '../public')));
app.set('views',path.join(__dirname, '../public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');

})
let messages = [] as Message[];
io.on('connection', socket =>{
    console.log(`${socket.id} conectado!`)

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        
        messages.push(data);
        console.log(data);
    socket.broadcast.emit('receivedMessage', data);
        if(messages.length >= 30) {
            messages.shift();
            socket.emit('MaxMessages', messages);
        }
    })
})


server.listen(3000);