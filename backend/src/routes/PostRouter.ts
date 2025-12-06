import { PostService } from '../services/PostService';
import { Post } from '../generated/prisma/client';
import { RouterAPI } from '../models/RouterAPI';

class PostRouter extends RouterAPI<PostService, Post> {
    constructor() {
        super(new PostService());
    }
}

export default new PostRouter().getRouter();
