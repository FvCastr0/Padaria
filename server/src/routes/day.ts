import { Request, Response, Router } from 'express';
import deleteAllDaysOfMonth from '../service/Day/deleteAllDaysOfMonth';
import getDay from '../service/Day/getDay';
import getExactDay from '../service/Day/getExactDay';

const dayRouter = Router();


dayRouter.get('/days', async (req: Request, res: Response) => {
  const day = await getDay.execute();
  res.send({ msg: day.msg, data: day.data }).status(day.statusCode)
})

dayRouter.get('/day/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  const day = await getExactDay.execute(id)
  res.send({ msg: day.msg, data: day.data }).status(day.statusCode)
})

dayRouter.delete('/day/:month', async (req: Request<{ month: number }>, res: Response) => {
  const { month } = req.params
  const day = await deleteAllDaysOfMonth.execute(month)
  res.send({ msg: day.msg, data: day.data, err: day.data }).status(day.statusCode)
})


export { dayRouter };

