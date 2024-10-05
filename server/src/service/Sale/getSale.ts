import { PrismaClient } from '@prisma/client';
import ResponseData from '../../interface/ResponseData';

class GetSale {
  async execute(): Promise<ResponseData> {
    const sale = new PrismaClient().sale;

    try {
      const data = await sale.findMany();
      return { msg: "All sales loaded", statusCode: 201, data };
    }
    catch (e) {
      return { msg: e, statusCode: 500 };
    }

  }
}


export default new GetSale();

