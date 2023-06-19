import { EventEmitter } from 'events';
import Dispatcher from './Dispatcher';
import {AUDIENCE_ADD, AUDIENCE_EDIT_NAME, AUDIENCE_EDIT_STRATEGY, AUDIENCE_EDIT_DESCRIPTION} from "./constants/actionConstants";
// import {ping} from "./PingBrowser";
// import actions from "./actions";

const CE = 'CHANGE_EVENT';

class Storage extends EventEmitter {
  addChangeListener(c) {
    this.addListener(CE, c);
  }

  emitChange() {
    this.emit(CE);
  }
}

const store = new Storage();

Dispatcher.register((p) => {
  switch (p.actionType) {
    case CHOOSE_COLLECTION:
      store.emitChange()
      break;

    case SAVE_DEALS:
        store.emitChange();
      break;

    default:
      console.warn(`TYPE IS FUCKED. Got unexpected type ${p.type}`);
      break;
  }
});

export default store;