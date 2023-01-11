import { Model } from 'mongoose';

abstract class FactoryDatabase<T extends {} = any, U extends {} = any> {
  abstract model: Model<T>;
  abstract data: (arg?: Partial<U>) => Promise<U>;

  public create = async (arg?: Partial<U>) => {
    const data = await this.data(arg);

    return await this.model.create(data);
  };

  public createMany = async (count: number = 1, arg?: Partial<U>) => {
    const dataArray: Partial<U>[] = [];

    for await (let _k of Array.from({ length: count })) {
      const data = await this.data(arg);

      dataArray.push(data);
    }

    return await this.model.create(dataArray);
  };

  public insertMany = async (args: Partial<U>[]) => {
    const dataArray: Partial<U>[] = [];

    for await (let arg of args) {
      const data = await this.data(arg);

      dataArray.push(data);
    }

    return await this.model.create(dataArray);
  };

  public deleteMany = async () => {
    await this.model.deleteMany();
  };
}

export default FactoryDatabase;
