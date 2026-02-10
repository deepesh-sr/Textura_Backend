import type { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Role } from '../database/model.js'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized, token missing or invalid"
            })
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (token && jwtSecret) {
            const decodedMessage = jwt.verify(token, jwtSecret)
            // console.log(decodedMessage)
            //   @ts-ignore
            req.userid = decodedMessage.userid;
            next();
        }

    } catch (error) {
        console.error(error);
        res.status(401).json({
            success: false,
            error: "Unauthorized, token missing or invalid"
        })
    }
}
export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized, token missing or invalid"
            })
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (token && jwtSecret) {
            const decodedMessage = jwt.verify(token, jwtSecret)
            //   @ts-ignore
            req.role = decodedMessage.role;
            //@ts-ignore
            req.userid = decodedMessage.userid;
            //@ts-ignore
            if (req.role === Role.Teacher) {
                next();
            }
            else { 
                res.status(403).json({
                    success: false,
                    error: "Forbidden, admin access required"
                })
            }
        }

    } catch (error) {
        console.error(error);
        res.status(401).json({
            success: false,
            error: "Unauthorized, token missing or invalid"
        })
    }
}

export const authenticateStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized, token missing or invalid"
            })
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (token && jwtSecret) {
            const decodedMessage = jwt.verify(token, jwtSecret)
            //   @ts-ignore
            req.role = decodedMessage.role;
            //@ts-ignore
            if (req.role === Role.User) {
                //@ts-ignore
                req.userid = decodedMessage.userid;
                next();
            }
            else { 
                res.status(403).json({
                    success: false,
                    error: "Forbidden, user access required"
                })
            }
        }

    } catch (error) {
        console.error(error);
        res.status(401).json({
            success: false,
            error: "Unauthorized, token missing or invalid"
        })
    }
}