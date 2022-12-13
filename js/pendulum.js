Math.betterRound = (n, precision) => {
    return Math.round(n * Math.pow(10, precision)) / Math.pow(10, precision);
}

class NPendulum extends KuramotoOscillator {
    constructor(N, w, h, length_of_pendulum) {
        if (N < 2) {
            throw new Error("N can't be lower than 2");
        }
        super(N, 0.05);
        let pendulums = [];

        this.padding = 0.1 * w;
        let length = length_of_pendulum || 200;

        this.gravity = 100;

        let x_n = 0.0;
        let delta = ((w - 2 * this.padding) / (N - 1)) / w;
        x_n = this.padding / w;
        for (let i = 0; i < N; i++) {
            pendulums.push({
                position: {
                    x: x_n * w,
                    y: 0.1 * h
                },
                phase_angle: ((Math.random() * 2) - 1) * Math.PI / 14,
                phase_velocity: 0.1 * Math.random(),
                length: length,
            });
            x_n += delta;
        }

        this.w = w;
        this.h = h;

        this.pendulums = pendulums;
        this.radius = 40;
        this.min_deviance = 1000000;

        this.bar_size = 50;
    }

    simulate(ctx, n) {
        let time_step = 0.001;

        for (let j = 0; j < n; j++) {
            for (let i = 0; i < this.pendulums.length;i++) {
                let theta0 = this.pendulums[i].phase_angle;

                let f = 0;
                for(let t = 0; t < this.pendulums.length; t++) {
                    f += Math.sin(this.pendulums[t].phase_angle - this.pendulums[i].phase_angle);
                }

                this.pendulums[i].phase_angle += this.pendulums[i].phase_velocity * time_step + (this.K / this.N) * f * time_step;
                this.pendulums[i].phase_velocity -= (this.gravity / this.pendulums[i].length) * Math.sin(theta0) * time_step;
            }
        }

        this.draw(ctx);
    }

    draw(ctx) {
        ctx.fillStyle = "rgb(245, 245, 245)";
        ctx.fillRect(0, 0, this.w, this.h);

        ctx.beginPath();
        ctx.rect(this.padding / 2, this.pendulums[0].position.y - this.bar_size + this.h * 0.1, this.w - this.padding, this.bar_size);
        ctx.stroke();
        
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        let text = "Coupling Constant: " + this.K.toString();
        let height = ctx.measureText("m").width;
        ctx.fillText(text, this.w / 2, this.pendulums[0].position.y - this.bar_size / 2 + height / 2 + this.h * 0.1);

        for (const pendulum of this.pendulums) {
            ctx.beginPath();
            ctx.moveTo(pendulum.position.x, pendulum.position.y + this.h * 0.1);
            ctx.lineTo(pendulum.position.x + pendulum.length * Math.sin(pendulum.phase_angle), pendulum.position.y + pendulum.length * Math.cos(pendulum.phase_angle) + this.h * 0.1);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(pendulum.position.x + (pendulum.length + this.radius) * Math.sin(pendulum.phase_angle), pendulum.position.y + (pendulum.length + this.radius) * Math.cos(pendulum.phase_angle) + this.h * 0.1, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.font = "16px Arial";
            ctx.fillText(Math.betterRound(pendulum.phase_angle, 2).toString() + "\nrads", pendulum.position.x + (pendulum.length + this.radius) * Math.sin(pendulum.phase_angle), pendulum.position.y + (pendulum.length + this.radius) * Math.cos(pendulum.phase_angle) + this.h * 0.1);
        }
    }
}