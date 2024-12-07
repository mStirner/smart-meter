module.exports = (registers) => {


    /**
     * Voltage
     */

    registers.add({
        description: "L1 Voltage",
        address: Buffer.from([0x00, 0x00]),
        value: 0,
        unit: "V",
        key: "VOLTAGE_L1"
    });

    registers.add({
        description: "L2 Voltage",
        address: Buffer.from([0x00, 0x02]),
        value: 0,
        unit: "V",
        key: "VOLTAGE_L2"
    });

    registers.add({
        description: "L3 Voltage",
        address: Buffer.from([0x00, 0x04]),
        value: 0,
        unit: "V",
        key: "VOLTAGE_L3"
    });


    /**
     * Ampere
     */

    registers.add({
        description: "L1 Ampere",
        address: Buffer.from([0x00, 0x06]),
        value: 0,
        unit: "A",
        key: "CURRENT_L1"
    });

    registers.add({
        description: "L2 Ampere",
        address: Buffer.from([0x00, 0x08]),
        value: 0,
        unit: "A",
        key: "CURRENT_L2"
    });

    registers.add({
        description: "L3 Ampere",
        address: Buffer.from([0x00, 0x10]),
        value: 0,
        unit: "A",
        key: "CURRENT_L3"
    });


    /**
     * Watt
     */

    registers.add({
        description: "L1 Power",
        address: Buffer.from([0x00, 0x12]),
        value: 0,
        unit: "W",
        key: "POWER_L1"
    });

    registers.add({
        description: "L2 Power",
        address: Buffer.from([0x00, 0x14]),
        value: 0,
        unit: "W",
        key: "POWER_L2"
    });

    registers.add({
        description: "L3 Power",
        address: Buffer.from([0x00, 0x16]),
        value: 0,
        unit: "W",
        key: "POWER_L3"
    });


    /**
     * Misc
     */

    registers.add({
        description: "Sum of L1/L2/L3 currents",
        address: Buffer.from([0x00, 0x30]),
        value: 0,
        unit: "A",
        key: "CURRENT_SUM"
    });

    registers.add({
        description: "Total system power",
        address: Buffer.from([0x00, 0x34]),
        value: 0,
        unit: "W",
        key: "POWER_TOTAL"
    });

    registers.add({
        description: "Frequency",
        address: Buffer.from([0x00, 0x46]),
        value: 0,
        unit: "Hz",
        key: "FREQUENZ"
    });

    registers.add({
        description: "Total active Energy",
        address: Buffer.from([0x01, 0x56]),
        value: 0,
        unit: "kWh",
        key: "ENERGY_TOTAL"
    });

};