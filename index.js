const {createServer, DEFAULT_PORT} = require('@derhuerst/gemini')
const fs = require('fs');

// handlers
var fileServer = require("./handlers/fileServer");

const handleRequest = (req, res) => {
        var handlers = [
            fileServer(process.env.DOCUMENT_ROOT)
        ];
        var idx = 0;
        var next = function() {
            idx++;
            if(idx == handlers.length) {
                res.notFound();
                return;
            }
            handlers[idx](req,res,next);
        }
        handlers[idx](req,res,next);
}

const server = createServer({
	cert: fs.readFileSync(process.env.TLS_CERT_PATH),
	key: fs.readFileSync(process.env.TLS_KEY_PATH),
}, handleRequest)

server.listen(DEFAULT_PORT)
server.on('error', console.error)
