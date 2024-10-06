import { PrismaClient } from '@prisma/client';
import { UUID } from 'mongodb';
import ResponseData from '../../interface/ResponseData';

class NewSale {
  async execute({ value, date }: { value: number, date: Date }): Promise<ResponseData> {
    const sale = new PrismaClient().sale;
    const id = new UUID();
    const dayID = new UUID();
    const dateOptions = {
      timeZone: 'America/Sao_Paulo',
      locale: 'pt-BR'
    }
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    const day = date.toLocaleDateString('pt-BR', dateOptions)
    const month = Number(day.slice(3, 5))

    try {
      await sale.create({
        data: {
          id: String(id),
          value,
          date: day,
          time,
          day: {
            connectOrCreate: {
              where: {
                day
              },
              create: {
                day,
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
