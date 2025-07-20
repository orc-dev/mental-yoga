/**
 * A delta-second raw Timer
 */
export default class Timer {
    #timeLimit;
    #timeElapsed;
    
    constructor(timeLimit = 0.5) {
        this.#timeLimit = timeLimit; // in sec
        this.#timeElapsed = 0;
    }

    #reset() {
        this.#timeElapsed = 0;
    }

    #update(delta) {
        this.#timeElapsed += delta;
    }

    #timeIsUp() {
        return this.#timeElapsed >= this.#timeLimit;
    }

    ding(delta) {
        this.#update(delta);
        const check = this.#timeIsUp();
        if (check) this.#reset();
        return check;
    }

    whisper(msg = '') {
        console.log(`Hello from Timer: ${msg}`);
    }
}