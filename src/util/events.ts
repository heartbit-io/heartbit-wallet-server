import EventEmitter from "events";
import { NextFunction, Request, Response } from "express";
import path from "path";
import admin from '../config/firebase-config';
import { UserRoles } from "./enums";
import { DoctorRequest } from "../middleware/DoctorAuth";

const eventEmitter = new EventEmitter();

eventEmitter.on('event:doctor_verified', (_req: Request, res:Response) => {
    return res.sendFile(path.join(__dirname, 'public', 'doctor.html'));
});

eventEmitter.emit('event:doctor_verified', async (req: DoctorRequest, res: Response, next: NextFunction) => { 
    const token = req?.headers?.authorization?.split(' ')[1] || '';

    try {
        const decodeValue = await admin.auth().verifyIdToken(token);

        if (decodeValue && decodeValue.email && decodeValue.role== UserRoles.DOCTOR) {
            req.email = decodeValue.email;
            req.role = decodeValue.role;
            return next();
        }

        return;
    } catch (error) {
        return;
    }
});
