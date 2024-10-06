import { PrismaClient } from '@prisma/client';
import { UUID } from 'mongodb';
import ResponseData from '../../interface/ResponseData';

interface DateProps {
  time: string,
  day: string
}

class NewSale {
  async execute({ value, date }: { value: number, date: DateProps }): Promise<ResponseData> {
    const sale = new PrismaClient().sale;
    const id = new UUID();
    const dayID = new UUID();
    const month = Number(date.day.slice(3, 5))

    try {
      await sale.create({
        data: {
          id: String(id),
          value,
          date: date.day,
          time: date.time,
          day: {
            connectOrCreate: {
              where: {
                day: date.day
              },
              create: {
                day: date.day,
                month,
                id: String(dayID)
              }
            }
          }
        }
      })
      return { msg: "Sale created successfully", statusCode: 201 };
    } catch (e) {
      return { msg: e, statusCode: 500 };
    }
  }
}

export default new NewSale();
