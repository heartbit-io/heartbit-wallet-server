import admin from 'firebase-admin';
import env from './env';


export default admin.initializeApp({
	credential: admin.credential.cert({
		projectId: env.FB_PROJECT_ID,
		privateKey: env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
		clientEmail: env.FB_CLIENT_EMAIL,
	}),
	// databaseURL: `https://${env.FB_PROJECT_ID}.firebaseio.com`,
});
