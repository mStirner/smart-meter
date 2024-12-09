module.exports = (registers) => {

    registers.add({
        description: "Voltage",
        address: Buffer.from([0x00, 0x00]),
        value: 0,
        unit: "V",
        key: "VOLTAGE"
    });

    registers.add({
        description: "Current",
        address: Buffer.from([0x00, 0x06]),
        value: 0,
        unit: "A",
        key: "CURRENT"
    });

    registers.add({
        description: "Power",
        address: Buffer.from([0x00, 0x12]),
        value: 0,
        unit: "W",
        key: "POWER"
    });

    registers.add({
        description: "Frequenz",
        address: Buffer.from([0x00, 0x46]),
        value: 0,
        unit: "Hz",
        key: "FREQUENZ"
    });
    
    registers.add({
        description: "Import active energy",
        address: Buffer.from([0x00, 0x48]),
        value: 0,
        unit: "kWh",
        key: "ENERGY_TOTAL"
    });    

};
