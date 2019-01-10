import Runnable from './runnable';
import {inherits} from './utils';

function Hook(...args) {
    Runnable.call(this, ...args);
    this.posHookFunction = undefined;
}

inherits(Hook, Runnable);

Hook.prototype.run = function(suite, posHookFunction) {
    try {
        this.parent = suite;
        this.posHookFunction = posHookFunction;
        suite.inheritTimeoutLimit(this);
        
        if(this.fn.length >= 1) {
            this.fn.call(this.context, this.done.bind(this));
        }else{
            this.fn.call(this.context);
            if(this.limitWasExtrapolated())
                this.eventBus.emit('runEnd', this);
            posHookFunction();
        }
    } catch(error) {
        this.error = error;
        this.eventBus.emit('runEnd', this);
    } 
}

Hook.prototype.done = function() {
    try {
        if(this.limitWasExtrapolated())
            this.eventBus.emit('runEnd', this);
        this.posHookFunction();
    } catch(error) {
        this.error = error;
        this.eventBus.emit('runEnd', this);
    }
}

export default Hook;