import { Request, Response, Router } from 'express';
import getExactDaySales from '../service/Sale/getExactDaySales';
import getSale from '../service/Sale/getSale';
import newSale from '../service/Sale/newSale';

const saleRouter = Router();

saleRouter.get('/sale', async (req: Request, res: Response) => {
  const sales = await getSale.execute();
  res.send({ msg: sales.msg, data: sales.data }).status(sales.statusCode)
})

saleRouter.get('/sale/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  const day = await getExactDaySales.execute(id)
  res.send({ msg: day.msg, data: day.data }).status(day.statusCode)
})

saleRouter.post('/sale/newSale', async (req: Request, res: Response) => {
  const valueBody = req.body.value;
  const value = Number(valueBody);
  if (value > 0 && value !== 0) {
    const sale = await newSale.execute({ value })
    res.send({ msg: sale.msg }).status(sale.statusCode);
  } else {
    res.send({ msg: "Valor deve ser diferente de zero" }).status(400);
  }
});




export { saleRouter };

