class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */

    constructor(config) {
        if (!config) {
            throw new Error("Config should be passed to constructor");
        } else {
            this.config = config;
            this.activeState = config.initial;
            this.history = {
                undo: [],
                redo: [],
            }
        }

    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.activeState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        const nextState = this.config.states[state];
        if (nextState) {
            this.history.undo.push(this.activeState);
            this.history.redo = [];
            this.activeState = state;
        } else {
            throw new Error("Unknown state passed");
        }
    }


    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const activeState = this.config.states[this.activeState];
        const newActiveState = activeState.transitions[event];

        if (newActiveState) {
            this.history.undo.push(this.activeState);
            this.history.redo = [];
            this.activeState = newActiveState;
        } else {
            throw new Error("event in current state isn't exist");
        }

    }


    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.activeState = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        const allStates = Object.keys(this.config.states)
        if (event) {
            const states = this.config.states;

            function transitionIsExist(state) {
                return states[state].transitions[event];
            }
            const statesForEvent = allStates.filter(transitionIsExist);
            return statesForEvent;
        } else {
            return allStates;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.history.undo.length) {
            const previousState = this.history.undo.pop();
            this.history.redo.push(this.activeState);
            this.activeState = previousState;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
      if (this.history.redo.length) {
          const nextState = this.history.redo.pop();
          this.activeState = nextState;
          return true;
      } else {
          return false;
      }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
      this.history = {
          undo: [],
          redo: [],
      }
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
