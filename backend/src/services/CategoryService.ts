import { Category } from "../generated/prisma/client"
import { Prisma } from "../managers/Prisma";
import { Crud } from "../models/Crud";

class CategoryService extends Crud<Category> {
    public override async create(category: Category): Promise<Category> {
        let { name } = category;
        let createdCategory: Category = await Prisma.category.create({
            data: { name }
        })
        return createdCategory;
    }

    public override async getById(id: number): Promise<Category | null> {
        let foundCategory: Category | null = await Prisma.category.findFirst({
            where: { id: id }
        });
        return foundCategory;
    }

    public override async updateById(id: number, category: Category): Promise<Category> {
        let { name } = category;

        let updatedCategory: Category = await Prisma.category.update({
            where: { id },
            data: { name }
        });
        return updatedCategory;
    }

    public override async deleteById(id: number): Promise<void> {
        await Prisma.category.delete({
            where: { id }
        });
    }
}

export { CategoryService };