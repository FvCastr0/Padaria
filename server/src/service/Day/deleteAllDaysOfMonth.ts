import { PrismaClient } from "@prisma/client";
import Response from "../../interface/ResponseData";

class DeleteAllDaysOfMonth {
  async execute(month: number): Promise<Response> {

    const days = new PrismaClient().day
    const sales = new PrismaClient().sale

    try {
      const dayId = await days.findFirst({
        where: {
          month: Number(month)
        },
        select: {
          id: true
        }
      });

      await sales.deleteMany({
        where: {
          dayId: String(dayId.id)
        }
      });

      await days.deleteMany({
        where: {
          month: Number(month)
        },
      });
      return {
        msg: "Mês fechado",
        statusCode: 200,
      }
    }
    catch (e) {
      return {
        msg: "Internal server error",
        statusCode: 500,
        data: e
      }
    }
  }
}

export default new DeleteAllDaysOfMonth();
