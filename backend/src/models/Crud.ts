import { ICrud } from "../models/interfaces/ICrud";

class Crud<T> implements ICrud<T> {
    
    public async create(t: T): Promise<T> {
        return t;
    }

    public async getById(id: number): Promise<T | null> {
        return null;
    }

    public async updateById(id: number, t: T): Promise<T> {
        return t;
    }

    public async deleteById(id: number): Promise<void>{}
}

export{Crud}