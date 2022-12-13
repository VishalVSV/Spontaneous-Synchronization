# Spontaneous-Synchronization
A simple simulation of N pendulums attached to a support. Uses the kuramoto model to model spontaneous synchronization.

This simulation uses Euler Integration to solve the pendulums' equations of motion. The timestep is set to 0.001 and the integration is done 100 times per frame. This allows us to get reasonable accuracy for highest simplicity and speed. However, this method eventually loses stability and results in odd behaviour.
