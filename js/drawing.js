var canvas = document.getElementById("canvas");

canvas.width = document.body.clientWidth * 0.8;
canvas.height = document.body.clientHeight / 2;

var ctx = canvas.getContext('2d');

let pendulum = null;

let working = true;

let loop;

function start() {
    loop = window.setInterval(() => {
        if (working) {
            pendulum.simulate(ctx, 100);
        }
    });
}

function end() {
    window.clearInterval(loop);
}

function onChange() {
    if (pendulum) {
        end();

        pendulum = new NPendulum(document.getElementById("num_pendulums").value, canvas.clientWidth, canvas.clientHeight, parseInt(document.getElementById("length_p").value));
        pendulum.gravity = parseFloat(document.getElementById("gravity").value);
        pendulum.K = document.getElementById("k_val").value;
        
        start();
    }
}

function softChange() {
    if (pendulum) {
        for (let i = 0; i < pendulum.pendulums.length; i++) {
            pendulum.pendulums[i].length = parseInt(document.getElementById("length_p").value);
        }
        if (document.getElementById("gravity").value != "")
        pendulum.gravity = parseFloat(document.getElementById("gravity").value);

        pendulum.draw(ctx);
    }
}

function start_sim() {
    end();
    
    pendulum = new NPendulum(document.getElementById("num_pendulums").value, canvas.clientWidth, canvas.clientHeight, parseInt(document.getElementById("length_p").value));
    pendulum.gravity = parseFloat(document.getElementById("gravity").value);
    pendulum.K = document.getElementById("k_val").value;
    
    start();
}