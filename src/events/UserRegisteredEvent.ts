import {EventEmitter} from 'node:events';

class UserRegisteredEvent extends EventEmitter {
	constructor() {
		super();
	}
}

export default UserRegisteredEvent;
