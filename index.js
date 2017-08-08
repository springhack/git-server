/**
        Author: SpringHack - springhack@live.cn
        Last modified: 2017-08-08 22:32:12
        Filename: index.js
        Description: Created by SpringHack using vim automatically.
**/
const http = require('http');
const spawn = require('child_process').spawn;
const path = require('path');
const backend = require('git-http-backend');
const zlib = require('zlib');

const server = http.createServer(function (req, res) {
    const repo = req.url.split('/')[1];
    const dir = path.join(__dirname, '..', repo);
    const reqStream = req.headers['content-encoding'] == 'gzip' ? req.pipe(zlib.createGunzip()) : req;

    reqStream.pipe(backend(req.url, function (err, service) {
        if (err) return res.end(`${err}\n`);

        res.setHeader('content-type', service.type);
        console.log(service.action, repo, service.fields);

        const ps = spawn(service.cmd, service.args.concat(dir));
        ps.stdout.pipe(service.createStream()).pipe(ps.stdin);

    })).pipe(res);
});

server.listen(5000);
