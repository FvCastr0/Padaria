export interface SalesProps {
    date: string
    dayId: string
    id: string
    time: string
    value: number
}

export interface DayProps {
    id: string,
    day: string
    sales: SalesProps[]
}

