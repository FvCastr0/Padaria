import { PrismaClient } from '@prisma/client';
import ResponseData from '../../interface/ResponseData';

class getExactDaySales {
  async execute(id: string): Promise<ResponseData> {
    const sale = new PrismaClient().sale;

    try {
      const data = await sale.findMany({
        where: {
          dayId: id
        }
      });
      return { msg: "Sales loaded", statusCode: 200, data };
    }
    catch (e) {
      console.log(e);

      return { msg: e, statusCode: 500 };
    }

  }
}

export default new getExactDaySales();
