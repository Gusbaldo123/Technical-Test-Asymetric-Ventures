import { ICrud } from "../models/interfaces/ICrud";

class Crud<T> implements ICrud<T> {
    async create(t: T): Promise<T | null> { return t; }
    async getById(id: number): Promise<T | null> { return null; }
    async updateById(id: number, t: T): Promise<T> { return t; }
    async deleteById(id: number): Promise<void> { }
}
export { Crud };
