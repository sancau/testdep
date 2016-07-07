///<reference path="../typings/index.d.ts"/>

'use strict';

import * as ex from 'express';

var app = ex();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(ex.static(__dirname + '/public'));

let data = '25';
app.get('/', (req: ex.Request, res: ex.Response) => res.render('index', {data: data}));

let port = 2500;
var server = app.listen(port, () => console.log(`Up on ${port}..`));