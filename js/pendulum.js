class NPendulum extends KuramotoOscillator {
    constructor(N, w, h, length_of_pendulum, phase_spread) {
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
                phase_angle: ((Math.random() * 2) - 1) * (phase_spread || (Math.PI / 14)),
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

        this.graph_vals = [];
        this.x = 0;
    }

    simulate(ctx, n,ctx_graph, graph_width, graph_height) {
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

        this.graph_vals.push({
            x: this.x++,
            y: this.r_val()
        });

        this.draw(ctx,ctx_graph, graph_width, graph_height);
    }

    r_val() {
        let real_vals = 0;
        let imaginary_vals = 0;

        for (const pendulum of this.pendulums) {
            real_vals += Math.cos(pendulum.phase_angle);
            imaginary_vals += Math.sin(pendulum.phase_angle);
        }

        let e_theta = Math.sqrt(real_vals * real_vals + imaginary_vals * imaginary_vals);

        let r = e_theta / this.N;

        return r;
    }

    draw(ctx, ctx_graph, graph_width, graph_height) {
        ctx.fillStyle = "rgb(245, 245, 245)";
        ctx.fillRect(0, 0, this.w, this.h);

        ctx.beginPath();
        ctx.rect(this.padding / 2, this.pendulums[0].position.y - this.bar_size + this.h * 0.1, this.w - this.padding, this.bar_size);
        ctx.stroke();
        
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        let text = "Coupling Constant: " + this.K.toString() + " Phase Coherance: " + this.r_val().toFixed(3);
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
            ctx.fillText(pendulum.phase_angle.toFixed(2) + "\nrads", pendulum.position.x + (pendulum.length + this.radius) * Math.sin(pendulum.phase_angle), pendulum.position.y + (pendulum.length + this.radius) * Math.cos(pendulum.phase_angle) + this.h * 0.1);
        }

        if (ctx_graph) {
            ctx_graph.fillStyle = "rgb(245, 245, 245)";
            ctx_graph.fillRect(0, 0, this.w, this.h);

            while (this.graph_vals.length > graph_width / 2) {
                this.graph_vals.shift();
            }

            ctx_graph.strokeStyle = "grey";
            ctx_graph.beginPath();
            ctx_graph.moveTo(0, graph_height / 4);
            ctx_graph.lineTo(graph_width, graph_height / 4);
            ctx_graph.stroke();

            ctx_graph.strokeStyle = "black";
            ctx_graph.beginPath();
            ctx_graph.moveTo(0, graph_height / 2);
            ctx_graph.lineTo(graph_width, graph_height / 2);
            ctx_graph.stroke();

            ctx_graph.fillStyle = "black";
            ctx_graph.font = "1.2em Arial";
            ctx_graph.fillText("0", 2, graph_height / 2 - 4);
            
            ctx_graph.fillStyle = "black";
            ctx_graph.font = "1.2em Arial";
            ctx_graph.fillText("+1", 2, graph_height / 4 - 4);

            
            ctx_graph.fillStyle = "black";
            ctx_graph.font = "1.2em Arial";
            ctx_graph.fillText("r vs time", graph_width / 2 - ctx_graph.measureText("r vs time").width / 2, graph_height - ctx_graph.measureText("M").width);

            let offset = ctx_graph.measureText("+1").width;
            offset *= 1.5;
            
            ctx_graph.strokeStyle = "black";
            ctx_graph.beginPath();
            ctx_graph.moveTo(offset, 0);
            ctx_graph.lineTo(offset, graph_height);
            ctx_graph.stroke();


            ctx_graph.strokeStyle = "rgb(200,10,10)";
            for (let i = 0; i < this.graph_vals.length - 1; i++) {
                const p1 = this.graph_vals[i];
                const p2 = this.graph_vals[i + 1];
                
                ctx_graph.beginPath();
                ctx_graph.moveTo(i * 2 + offset, graph_height / 2 - p1.y * graph_height / 4);
                ctx_graph.lineTo((i + 1) * 2 + offset, graph_height / 2 - p2.y * graph_height / 4);
                ctx_graph.stroke();
            }
        }
    }
}