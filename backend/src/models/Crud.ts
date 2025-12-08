import { ICrud } from "../models/interfaces/ICrud";

class Crud<T, TDTO> implements ICrud<T, TDTO> {
    async create(t: T): Promise<TDTO | null> { return null; }
    async getById(id: number): Promise<TDTO | null> { return null; }
    async updateById(id: number, t: T): Promise<TDTO | null> { return null; }
    async deleteById(id: number): Promise<boolean> { return false;}
}
export { Crud };
