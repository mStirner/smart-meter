const Serialport = require('serialport');
const ByteLength = require('@serialport/parser-byte-length');
const checksum = require("./checksum.js");

// holding registers
const registers = new Set();
require("./registers.js")(registers);



process.env = Object.assign({
    SERIAL_DEVICE: "/dev/ttyUSB0",
    SERIAL_BAUDRATE: "9600",
    SERIAL_PARITY: "none",
    SERIAL_STOPBITS: "1",
    SERIAL_DATABITS: "8",
    QUERY_INTERVAL: "5000"
}, process.env);


const port = new Serialport(process.env.SERIAL_DEVICE, {
    baudRate: Number(process.env.SERIAL_BAUDRATE),
    Parity: process.env.SERIAL_PARITY,
    stopBits: Number(process.env.SERIAL_STOPBITS),
    dataBits: Number(process.env.SERIAL_DATABITS)
});




port.open(() => {

    console.log("Serial port open")


    const parser = port.pipe(new ByteLength({
        length: 9
    }));

    const query = () => {

        let wrapper = Array.from(registers).map((register) => {
            return () => new Promise((resolve, reject) => {

                let { address } = register;

                let message = Buffer.concat([
                    Buffer.from([0x01, 0x04]),  // header: [0] slave address; [1] function code
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
                parser.once('data', incoming);

                // send "request"
                port.write(payload);

            });
        });



        wrapper.reduce((cur, prev) => {
            return cur.then(prev);
        }, Promise.resolve()).then(() => {

            //console.log("Registers queried", registers)

            process.stdout.write("\033c");

            console.log("Updated: %d", Date.now());

            Array.from(registers).forEach(({ description, value, unit }) => {
                console.log(`${description}: ${value}${unit}`)
            });

            setTimeout(query, Number(process.env.QUERY_INTERVAL));

        });


    };

    query();


});






/*
port.open(() => {

    console.log("Serial port open")

    const parser = port.pipe(new ByteLength({
        length: 9
    }));

    setInterval(() => {

        console.log("Query registers")

        registers.forEach(({ address, description, value, unit }) => {

            let message = Buffer.concat([
                Buffer.from([0x01, 0x04]),  // header: [0] slave address; [1] function code
                address,                    // register address
                Buffer.from([0x00, 0x02])   // "footer"        
            ]);

            let payload = Buffer.concat([
                message,
                checksum(message)
            ]);

            console.log("Send", payload)

            port.write(payload);

            parser.once('data', (data) => {

                let bytes = data.slice(3, -2);
                let val = bytes.readFloatBE(0).toFixed(2);

                // save value returnd
                value = val;

                // feedback
                console.log(`${description}: ${val} ${unit}`);

            });

        });

        console.log(registers);

    }, 5000);

});
*/