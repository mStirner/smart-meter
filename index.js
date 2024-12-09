process.env = Object.assign({
    NODE_ENV: "production",
    SERIAL_DEVICE: "/dev/ttyUSB0",
    SERIAL_BAUDRATE: "9600",
    SERIAL_PARITY: "none",
    SERIAL_STOPBITS: "1",
    SERIAL_DATABITS: "8",
    QUERY_INTERVAL: "5000",
    HTTP_ADDRESS: "0.0.0.0",
    HTTP_PORT: "8080",
    PRINT_STDOUT: "true",
    DEBUG: "smart-meter",
    SMART_METER_ID: "1",
    MODEL: "sdm72dm-v2"
}, process.env);


//const http = require("http");
const Serialport = require("serialport");
const ByteLength = require("@serialport/parser-byte-length");
const checksum = require("./checksum.js");
const WebSocket = require("ws");


var debug = () => { };

if (process.env.NODE_ENV === "development") {
    debug = require("debug")("smart-meter");
}


// holding registers
const registers = new Set();
require(`./registers/${process.env.MODEL}.js`)(registers);


const port = new Serialport(process.env.SERIAL_DEVICE, {
    baudRate: Number(process.env.SERIAL_BAUDRATE),
    Parity: process.env.SERIAL_PARITY,
    stopBits: Number(process.env.SERIAL_STOPBITS),
    dataBits: Number(process.env.SERIAL_DATABITS)
});

const wss = new WebSocket.WebSocketServer({
    port: Number(process.env.HTTP_PORT),
    host: process.env.HTTP_ADDRESS
});


wss.once("listening", (err) => {
    debug(err || `HTTP Server listneing on http://${process.env.HTTP_ADDRESS}:${process.env.HTTP_PORT}`);
});

wss.on("connection", () => {
    debug("WebSocket client connected");
});


port.open(() => {

    // feedback
    debug("Serial port open");

    // parse response
    const parser = port.pipe(new ByteLength({
        length: 9
    }));

    const query = () => {

        // feedback
        debug("Query function called");

        // wrap all queries (reading input register) as promise
        // build out of the proimse array a call stack
        // that execute one reading after the other
        let wrapper = Array.from(registers).map((register) => {
            return () => new Promise((resolve, reject) => {

                let { address } = register;

                let message = Buffer.concat([
                    Buffer.from([Number(process.env.SMART_METER_ID), 0x04]),  // header: [0] slave address; [1] function code
                    address,                    // register address
                    Buffer.from([0x00, 0x02])   // "footer"
                ]);

                let payload = Buffer.concat([
                    message,
                    checksum(message)
                ]);

                function incoming(data) {

                    let bytes = data.slice(3, -2);
                    let val = Number(bytes.readFloatBE(0).toFixed(2));

                    // save value returnd
                    register.value = val;

                    parser.off("data", incoming);

                    resolve(val);

                }

                // listen for response
                parser.once("data", incoming);

                // send "request"
                port.write(payload);

            });
        });


        // build out of the promises array a chain
        // "call stack" for query each after the other
        wrapper.reduce((cur, prev) => {
            return cur.then(prev);
        }, Promise.resolve()).then(() => {

            let register = Array.from(registers);
            let json = JSON.stringify(register);

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(json);
                }
            });


            if (process.env.PRINT_STDOUT === "true") {

                //process.stdout.write("\x33c");
                console.clear();
                console.log("Updated: %d", Date.now());

                register.forEach(({ description, value, unit }) => {
                    console.log(`${description}: ${value}${unit}`);
                });

            }

            debug("Queryied", json);

            // wait x of ms before calling ourself
            setTimeout(query, Number(process.env.QUERY_INTERVAL));

        });


    };

    // start query loop
    query();

});