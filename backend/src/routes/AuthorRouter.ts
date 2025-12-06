import { Request, Response } from 'express';
import { Author } from '../generated/prisma/client';
import { RouterAPI } from '../models/RouterAPI';
import { PostService } from '../services/PostService';
import { AuthorService } from '../services/AuthorService';

class AuthorRouter extends RouterAPI<AuthorService, Author> {
    constructor() {
        super(new AuthorService());
        this.router.get('/:id/posts', this.getPostList);
    }

    public getPostList = async (req: Request, res: Response): Promise<Response> => {
        const id: number = Number.parseInt(req.params.id);
        const postService = new PostService();
        const postsFromAuthor = await postService.getByAuthorId(id);
        return res.status(200).json(postsFromAuthor);
    }
}

export default new AuthorRouter().getRouter();
