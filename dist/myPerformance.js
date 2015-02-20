var max = 1;
var count = 0;
var perf = {
    track: track,
    profiles: [],
    report: report
};


function track(name, fn) {
    count++;
    if (count > max) {
        perf.last = name;
        //throw new Error('Reached performance limit: ' + name);

    }
    Game.getUsedCpu(function(cpu) {
        startCpu = cpu;
    });
    var start = new Date().getTime();
    var startCpu;
    fn();
    var endCpu;
    var end = new Date().getTime();
    Game.getUsedCpu(function(cpu) {
        endCpu = cpu;
    });
    var profile = {
        name: name,
        start: start,
        end: end,
        duration: end - start,
        cpu: endCpu - startCpu,
        toString: function() {
            return '[profile name: '+this.name+', duration: '+this.duration+'ms, cpu: '+this.cpu+']';
        }
    };
    perf.profiles.push(profile);
}


function report() {
    console.log('Last: ' + perf.last);
    for (var i = 0; i < perf.profiles.length; i++) {
        console.log(perf.profiles[i]);
    }
}

module.exports = perf;