import { Request, Response, NextFunction } from 'express'

export type Route<T> = (req: Request, res: Response, next?: NextFunction) => T
