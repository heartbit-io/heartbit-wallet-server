import admin from 'firebase-admin';
import config from './config';

const serviceAccount = config.firebase.serviceAccount;

export default admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});
