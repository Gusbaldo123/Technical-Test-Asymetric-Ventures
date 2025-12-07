interface ICrud<T,TDTO> {
    create(model: T): Promise<TDTO | null>;
    getById(id: number): Promise<TDTO | null>;
    updateById(id: number, model: T): Promise<TDTO|null>;
    deleteById(id: number): Promise<void>;
}

export { ICrud }