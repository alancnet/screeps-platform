module.exports = {
    units: {
        miner: {
            min: 2,
            max: 7,
            weight: 20,
            priority: 1
        },
        runner: {
            min: 2,
            weight: 20,
            priority: 2
        },
        defender: {
            max: Infinity,
            weight: 40,
            priority: 3
        },
        medic: {
            max: Infinity,
            weight: 20,
            priority: 4
        }
    }
};