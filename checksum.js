function crc16(buffer) {
    var crc = 0xFFFF;
    var odd;

    for (var i = 0; i < buffer.length; i++) {
        crc = crc ^ buffer[i];

        for (var j = 0; j < 8; j++) {
            odd = crc & 0x0001;
            crc = crc >> 1;
            if (odd) {
                crc = crc ^ 0xA001;
            }
        }
    }

    return crc;
};


module.exports = function checksum(message) {

    let crc1 = Buffer.from([crc16(message)]);
    let crc2 = Buffer.from([crc16(Buffer.concat([message, crc1]))]);

    return Buffer.concat([crc1, crc2]);

};