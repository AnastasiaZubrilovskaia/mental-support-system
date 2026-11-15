import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { addDays, formatShort } from '../utils/dates.js'

/** График оценок за последние дни. Дни без записи остаются пропусками. */
export default function DiaryChart({ entries, endDate, days = 14 }) {
  const byDate = new Map(entries.map((entry) => [entry.date, entry]))

  const data = Array.from({ length: days }, (_, index) => {
    const date = addDays(endDate, index - (days - 1))
    const entry = byDate.get(date)
    return {
      label: formatShort(date),
      mood: entry?.mood ?? null,
      fatigue: entry?.fatigue ?? null,
      anxiety: entry?.anxiety ?? null,
    }
  })

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
          <YAxis
            domain={[1, 10]}
            ticks={[1, 3, 5, 7, 10]}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Line type="monotone" dataKey="mood" name="Настроение" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 3 }} connectNulls />
          <Line type="monotone" dataKey="fatigue" name="Усталость" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3 }} connectNulls />
          <Line type="monotone" dataKey="anxiety" name="Тревожность" stroke="#f43f5e" strokeWidth={3} dot={{ r: 3 }} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}