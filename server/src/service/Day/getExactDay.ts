import { PrismaClient } from '@prisma/client';
import ResponseData from '../../interface/ResponseData';

interface SaleProps {
  id: string
  date: string
  value: number
  time: string
  dayId: string
}

interface DaysProps {
  id: string
  day: string
  sales?: SaleProps[]
}

class GetExactDay {
  async execute(dayId: string): Promise<ResponseData> {
    const day = new PrismaClient().day;
    const sale = new PrismaClient().sale;

    try {
      const data = [] as DaysProps[];

      const dayData = await day.findFirst({
        where: {
          id: dayId
        }
      });

      const sales = await sale.findMany({
        where: {
          dayId
        }
      });

      if (dayData !== null) {
        data.push({
          day: dayData.day,
          id: dayData.id,
          sales: []
        })
      }

      data.forEach(day => {
        sales.map(sale => {
          if (sale.dayId === day.id) {
            day.sales?.push(sale)
          }
        })
      })

      return { msg: "Day loaded", statusCode: 202, data };
    }
    catch (e) {
      return { msg: e, statusCode: 500 };
    }

  }
}

export default new GetExactDay();
