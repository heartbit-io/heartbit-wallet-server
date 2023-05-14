import EventEmitter from "events";
import { Request, Response } from "express";

const eventEmitter = new EventEmitter();

eventEmitter.on('event:doctor_verified', (_req: Request, res:Response) => {
    return res.redirect('https://portal.heartbit.io');
});

