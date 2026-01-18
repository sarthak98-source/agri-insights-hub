import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  data: any[];
}

const DemandLineChart = ({ data }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">
        Demand Trend (Actual vs Predicted)
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="actual"
            stroke="#16a34a"
            strokeWidth={3}
            name="Actual Demand"
            connectNulls
          />

          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#2563eb"
            strokeDasharray="5 5"
            strokeWidth={3}
            name="Predicted Demand"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DemandLineChart;
