import { Router, Request, Response } from 'express';
import { ICrud } from '../models/interfaces/ICrud';

class RouterAPI<S extends ICrud<M>, M> {
    protected router = Router();
    protected service: S;

    public constructor(service: S) {
        this.service = service;

        this.router.get('/:id', this.getById);
        this.router.post('/', this.create);
        this.router.put('/:id', this.updateById);
        this.router.delete('/:id', this.deleteById);
    }

    public getById = async (req: Request, res: Response): Promise<Response> => {
        const id = Number(req.params.id);
        try {
            const foundObj = await this.service.getById(id);

            if (!foundObj)
                return res.status(404).json({ message: `Not found: ${id}` });

            return res.status(200).json(foundObj);

        } catch (e) {
            return res.status(500).json({ message: e });
        }
    }

    public create = async (req: Request, res: Response): Promise<Response> => {
        const reqPost: M = req.body;
        try {
            const resPost = await this.service.create(reqPost);
            if(!resPost)
                return res.status(500).json({message:"Error on insert"});
            return res.status(201).json(resPost);
        } catch (e) {
            return res.status(500).json({message:e});
        }
    }

    public updateById = async (req: Request, res: Response): Promise<Response> => {
        const id = Number(req.params.id);
        const reqPost: M = req.body;
        try {
            const resPost = await this.service.updateById(id,reqPost);
            if(!resPost)
                return res.status(500).json({message:"Id not found"});
            return res.status(200).json(resPost);
        } catch (e) {
            return res.status(500).json({message:e});
        }
    }

    public deleteById = async (req: Request, res: Response): Promise<Response> => {
        const id = Number(req.params.id);
        try {
            await this.service.deleteById(id);
            return res.status(200).json({message:`Id ${id} deleted`});
        } catch (e) {
            return res.status(500).json({message:e});
        }
    }

    public getRouter(): Router {
        const clone = Router();
        clone.stack = [...this.router.stack];

        return clone;
    }
}

export { RouterAPI };
