import { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate, useParams } from 'react-router-dom';
import style from './index.module.css';
import { DayProps, SalesProps } from './interface/DayProps';
import http from './service/http';

function App() {
  const [days, setDays] = useState<DayProps[]>([]);
  const [exactDay, setExactDay] = useState<DayProps[]>([]);
  const [sales, setSales] = useState<SalesProps[]>([]);
  const [err, setErr] = useState<boolean>()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [salesDayTime, setSalesDayTime] = useState<SalesProps[]>([]);
  const [salesMorningTime, setSalesMorningTime] = useState<SalesProps[]>([]);
  const [isTableHoursActive, setIsTableHoursActive] = useState<boolean>(false);
  const [isGeneralInformationActive, setIsGeneralInformationActive] = useState<boolean>(true);
  const { id } = useParams();
  const navigate = useNavigate();

  function getMonthName(monthIndex: number) {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return months[monthIndex];
  }

  useEffect(() => {
    http.get("/days")
      .then(req => {
        const fetchedDays: DayProps[] = req.data.data

        if (0 > fetchedDays.length) setErr(true)
        else {
          setErr(false)
          setDays(fetchedDays)
        }
      })
      .catch(e => {
        setErr(true)
        throw new Error(e)
      })
  }, [])

  if (!isMenuOpen && id !== undefined) {
    navigate('/')
  }

  useEffect(() => {
    if (isMenuOpen) {
      http.get(`/day/${id}`)
        .then(req => {
          const fetchedDay = req.data.data as DayProps[]
          if (fetchedDay === null) setErr(true)
          else {
            setErr(false)
            setExactDay(fetchedDay)
          }
        })
        .catch(e => {
          setErr(true)
          throw new Error(e)
        })
    }
  }, [id, isMenuOpen])

  useEffect(() => {
    if (isMenuOpen) {
      http.get(`/sale/${id}`)
        .then(req => {
          const fetchedSales = req.data.data as SalesProps[]
          if (fetchedSales === null) setErr(true)
          else {
            setErr(false)
            setSales(fetchedSales)
          }
        })
        .catch(e => {
          setErr(true)
          throw new Error(e)
        })
    }
  }, [id, isMenuOpen])

  useEffect(() => {
    if (isMenuOpen) {
      const daySales = [] as SalesProps[];
      const morningSales = [] as SalesProps[];
      sales.map(sale => {
        const saleHour = Number(sale.time.slice(0, 2));
        if (saleHour >= 13 && saleHour < 21) {
          daySales.push(sale)
        }
        if (saleHour <= 13 && saleHour > 6) {
          morningSales.push(sale)
        }
      })
      setSalesDayTime(daySales);
      setSalesMorningTime(morningSales);
    }
  }, [sales, isMenuOpen])

  function calculateDailySales(sales: SalesProps[]): number {
    let totalValue = 0;
    sales.map(sale => {
      totalValue += sale.value
    })
    return totalValue;
  }


  return (
    <>
      <div className={style.title}>
        <h1>Padaria Sabor da Praça</h1>
        <h2>Vendas do mês {getMonthName(new Date().getMonth())}</h2>
      </div>
      <button className={style.btnMonth} onClick={async () => {
        const month = Number(prompt("Qual mês você quer fazer o fechamento? (Digite em número)"));
        if (month !== null) {
          await http.delete(`day/${month}`)
            .then(req => {
              console.log(req.data);

            })
        }

      }}>Fechar mês</button>
      <div className={style.cards}>
        {err === false ? (
          days.map((day) => <article className={style.dayCard} key={day.id}>
            <h1>Vendas do dia {day.day.substr(0, 2)} de {getMonthName(Number(day.day.substr(3, 2)) - 1)}</h1>
            <Link to={day.id} onClick={() => {
              setIsMenuOpen(!isMenuOpen)
            }}>Informações</Link>
          </article>
          )
        ) : (
          <h1>Nenhum dado disponivel</h1>
        )
        }
      </div>
      <div className={isMenuOpen ? style.bgSalesHours : style.disabledItems} />
      <div className={isMenuOpen ? style.salesHours : style.disabledItems}>

        {
          exactDay.map(day => <h1>Vendas do dia {day.day.substr(0, 2)} de {getMonthName(Number(day.day.substr(3, 2)) - 1)} </h1>)
        }

        <Link to='/' onClick={() => setIsMenuOpen(!isMenuOpen)
        }><IoMdClose /></Link>

        <button className={style.menuBtn} onClick={() => {
          setIsGeneralInformationActive(true)
          setIsTableHoursActive(false)
        }}>Informações gerais</button>

        <button className={style.menuBtn} onClick={() => {
          setIsGeneralInformationActive(false)
          setIsTableHoursActive(true)
        }}>Horários das vendas</button>

        <section className={isGeneralInformationActive ? style.generalInformation : style.disabledItems} >
          {
            exactDay.map((day) => <article className={style.general}>
              <p>Vendas do dia<br /><span>R${calculateDailySales(day.sales).toFixed(2)}</span></p>
              <p>Quantidade de vendas<br /> <span>{day.sales.length} </span></p>
              <p>Ticket médio<br /> <span>R${(calculateDailySales(day.sales) / day.sales.length).toFixed(2)}</span></p>
            </article>
            )
          }

          <article className={style.periods} >
            <div>
              <h2>Manhã</h2>
              {
                <div>
                  <p>Vendas: <span>R${salesMorningTime.length > 0 ? calculateDailySales(salesMorningTime).toFixed(2) : 0}</span></p>
                  <p>Quantidade de vendas: {salesMorningTime.length}<span></span></p>
                  <p>Ticket médio: {salesMorningTime.length > 0 ? (calculateDailySales(salesMorningTime) / salesMorningTime.length).toFixed(2) : 0}</p>
                </div>
              }
            </div>

            <div>
              <h2>Tarde e noite</h2>
              {
                <div>
                  <p>Vendas: <span>R${salesDayTime.length > 0 ? calculateDailySales(salesDayTime).toFixed(2) : 0}</span></p>
                  <p>Quantidade de vendas: {salesDayTime.length}<span></span></p>
                  <p>Ticket médio: {salesDayTime.length > 0 ? (calculateDailySales(salesDayTime) / salesDayTime.length).toFixed(2) : 0}</p>
                </div>
              }
            </div>
          </article>

        </section>

        <table border={1} className={isTableHoursActive ? style.tableHours : style.disabledItems}>
          <tr>
            <td>Data</td>
            <td>Horário</td>
            <td>Valor</td>
          </tr>

          {
            sales.map(sale => <tr key={sale.id}>
              <td>{sale.date}</td>
              <td>{sale.time}</td>
              <td>{sale.value}</td>
            </tr>
            )
          }
        </table>
      </div>
    </>
  )
}

export default App
