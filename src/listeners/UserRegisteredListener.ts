import AWS from 'aws-sdk';
import * as Sentry from '@sentry/node';
import UserRegisteredEvent from '../events/UserRegisteredEvent';
import env from '../config/env';
import logger from '../util/logger';
import mailchimp from '@mailchimp/mailchimp_marketing';

const UserRegisteredEventListener = new UserRegisteredEvent();

const sendWelcomeEmail = async (emailAddress: string) => {
	const ses = new AWS.SES({
		apiVersion: '2010-12-01',
		region: env.REGION,
		credentials: {
			accessKeyId: env.ACCESS_KEY,
			secretAccessKey: env.SECRET_ACCESS_KEY,
		},
	});

	const params = {
		Destination: {
			ToAddresses: [emailAddress],
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: `<h1 style=“text-align: center;“>Welcome to HeartBit!</h1>
                    <p style=“text-align: left;“>Hey there! </p>
                    <p style=“text-align: left;“></p>
                    <p style=“text-align: left;“>Welcome to HeartBit, your doctor friend at your finger tips. </p>
                    <p style=“text-align: left;“></p>
                    <p style=“text-align: left;“>With HeartBit, you get:</p>
                    <p></p>
                    <p style=“text-align: center;“>:earth_africa: <strong>Global Consultations</strong>: Expert health advice accessible from anywhere.</p>
                    <p style=“text-align: center;“></p>
                    <p style=“text-align: center;“>:zap: <strong>Priority Consultations</strong>: Use Bitcoin rewards to fast-track health Q &amp; A.</p>
                    <p style=“text-align: center;“></p>
                    <p style=“text-align: center;“>:speech_balloon: <strong>AI Translations</strong>: Ask questions in your language, get answers instantly.</p>
                    //The orange button “Ask Health Questions” Must be here
                    <p style=“text-align: left;“>Are you a doctor? If so, please let us know by <span style=“text-decoration:underline;“>submitting this form to help others</span>.<br><br>Of course, if you have any questions about HeartBit,<a href=“mailto:social@heartbit.io?subject=&amp;body=” tabindex=“-1" style=“text-decoration: none;“>&nbsp;<span style=“text-decoration:underline;“>I’m here to help</span></a>.</p>
                    <p style=“text-align: left;“></p>
                    <p style=“text-align: left;“>Excited to have you onboard!</p>
                    <p style=“text-align: left;“></p>
                    <p style=“text-align: left;“>The HeartBit Team</p>`,
				},
				Text: {
					Charset: 'UTF-8',
					Data: `Welcome to HeartBit!
                    <h1 style=“text-align: center;“>Welcome to HeartBit!</h1>
                    <p style=“text-align: left;“>Hey there! </p>
                    <p style=“text-align: left;“></p>
                    <p style=“text-align: left;“>Welcome to HeartBit, your doctor friend at your finger tips. </p>
                    <p style=“text-align: left;“></p>
                    <p style=“text-align: left;“>With HeartBit, you get:</p>
                    <p></p>
                    <p style=“text-align: center;“>:earth_africa: <strong>Global Consultations</strong>: Expert health advice accessible from anywhere.</p>
                    <p style=“text-align: center;“></p>
                    <p style=“text-align: center;“>:zap: <strong>Priority Consultations</strong>: Use Bitcoin rewards to fast-track health Q &amp; A.</p>
                    <p style=“text-align: center;“></p>
                    <p style=“text-align: center;“>:speech_balloon: <strong>AI Translations</strong>: Ask questions in your language, get answers instantly.</p>
                    //The orange button “Ask Health Questions” Must be here
                    <p style=“text-align: left;“>Are you a doctor? If so, please let us know by <span style=“text-decoration:underline;“>submitting this form to help others</span>.<br><br>Of course, if you have any questions about HeartBit,<a href=“mailto:social@heartbit.io?subject=&amp;body=” tabindex=“-1" style=“text-decoration: none;“>&nbsp;<span style=“text-decoration:underline;“>I’m here to help</span></a>.</p>
                    <p style=“text-align: left;“></p>
                    <p style=“text-align: left;“>Excited to have you onboard!</p>
                    <p style=“text-align: left;“></p>
                    <p style=“text-align: left;“>The HeartBit Team</p>`,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: 'Welcome to the Heartbit!',
			},
		},
		Source: env.SES_SENDER,
	};

	try {
		await ses.sendEmail(params).promise();
		logger.info(`Email sent to ${emailAddress}`);
	} catch (error) {
		Sentry.captureMessage(`Welcome Email error: ${error}`);
		logger.warn(error);
	}
};

const sendWelcomeEmailUsingMailChimp = async (emailAddress: string) => {
	mailchimp.setConfig({
		apiKey: env.MAILCHIMP_MARKETING_API_KEY,
		server: env.MAILCHIMP_SERVER,
	});

	try {
		await mailchimp.lists.addListMember(env.MAILCHIMP_LIST_ID, {
			email_address: emailAddress,
			status: 'subscribed',
		});
	} catch (error) {
		Sentry.captureMessage(`Mailchimp subcription error: ${error}`);
		logger.warn(error);
	}
};

UserRegisteredEventListener.on(
	'newUserRegistered',
	sendWelcomeEmailUsingMailChimp,
);

export default UserRegisteredEventListener;
