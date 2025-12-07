interface ICrud<T> {
    create(model: T): Promise<T | null>;
    getById(id: number): Promise<T | null>;
    updateById(id: number, model: T): Promise<T>;
    deleteById(id: number): Promise<void>;
}

export { ICrud }