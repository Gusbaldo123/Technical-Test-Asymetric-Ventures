import { CategoryService } from '../services/CategoryService';
import { Category } from '../generated/prisma/client';
import { RouterAPI } from '../models/RouterAPI';

class CategoryRouter extends RouterAPI<CategoryService, Category, Category> {
    constructor() {
        super(new CategoryService());
    }
}

export default new CategoryRouter().getRouter();
