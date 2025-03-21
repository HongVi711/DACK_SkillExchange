import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const ConnectionManagement = ({ connectionStats }) => {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Thống kê tổng số lượng kết nối</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={connectionStats}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default ConnectionManagement;
