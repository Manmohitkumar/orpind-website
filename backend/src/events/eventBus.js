import { EventEmitter } from 'events';

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
  }

  on(event, handler) {
    return super.on(event, handler);
  }

  emit(event, data) {
    return super.emit(event, data);
  }

  once(event, handler) {
    return super.once(event, handler);
  }

  off(event, handler) {
    return super.off(event, handler);
  }
}

const eventBus = new EventBus();

export default eventBus;
