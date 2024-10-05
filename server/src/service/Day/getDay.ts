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

class GetDay {
  async execute(): Promise<ResponseData> {
    const day = new PrismaClient().day;
    const sale = new PrismaClient().sale;

    try {
      const data = [] as DaysProps[]
      const daysData = await day.findMany();
      const sales = await sale.findMany();


      daysData.map(day => {
        data.push({
          day: day.day,
          id: day.id,
          sales: []
        })
      })

      data.forEach(day => {
        sales.map(sale => {
          if (sale.dayId === day.id) {
            day.sales?.push(sale)
          }
        })
      })

      return { msg: "All days loaded", statusCode: 202, data };
    }
    catch (e) {
      return { msg: e, statusCode: 500 };
    }

  }
}

export default new GetDay();
