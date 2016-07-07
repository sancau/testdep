import * as express from 'express';

var app = express().listen(3000, () => console.log('UP on 3000'));
app.getConnections((err: Error, count: number) => console.log(err || count));
