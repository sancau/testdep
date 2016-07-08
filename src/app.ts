///<reference path="../typings/index.d.ts"/>

'use strict';

import * as ex from 'express';
import * as bp from 'body-parser';

var app = ex();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(ex.static(__dirname + '/public'));
app.use(bp.json());
app.use(bp.urlencoded({
  extended: true
}));

app.get('/', (req: ex.Request, res: ex.Response) => res.render('chat'));

interface Message {
  author: string;
  time: Date;
  content: string;
}

interface MessageStore {
  tag: number;
  messages: Message[];
}

var data:MessageStore;

data = {
  tag: 0,
  messages: []
}

app.get('/api/chat/messages', function(req: ex.Request, res: ex.Response) {
    res.send({
      tag: data.tag,
      messages: data.messages.slice(data.messages.length - 50)
    });
});


app.post('/api/chat/messages',
  function (req: ex.Request, res: ex.Response) {
    let newMessage = {
      author: req.body.username,
      time: Date.now().toString(),
      content: req.body.content
    }
    appendMessage(newMessage)

    res.send({code: 200});
  } 
);

function appendMessage(message: any): void {
  data.messages.push(message);
  data.tag = data.tag + 1;
}

let port = 2500;
var server = app.listen(port, () => console.log(`[OK] Up on ${port}`));



