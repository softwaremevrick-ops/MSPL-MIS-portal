import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Day 1', scans: 4000 },
  { name: 'Day 2', scans: 3000 },
  { name: 'Day 3', scans: 2000 },
  { name: 'Day 4', scans: 2780 },
  { name: 'Day 5', scans: 1890 },
  { name: 'Day 6', scans: 2390 },
  { name: 'Day 7', scans: 3490 },
  { name: 'Day 8', scans: 3000 },
  { name: 'Day 9', scans: 2800 },
  { name: 'Day 10', scans: 3200 },
  { name: 'Day 11', scans: 2500 },
  { name: 'Day 12', scans: 2900 },
  { name: 'Day 13', scans: 3100 },
  { name: 'Day 14', scans: 2600 },
  { name: 'Day 15', scans: 3300 },
  { name: 'Day 16', scans: 2700 },
  { name: 'Day 17', scans: 3000 },
  { name: 'Day 18', scans: 2800 },
  { name: 'Day 19', scans: 3200 },
  { name: 'Day 20', scans: 2500 },
  { name: 'Day 21', scans: 2900 },
  { name: 'Day 22', scans: 3100 },
  { name: 'Day 23', scans: 2600 },
  { name: 'Day 24', scans: 3300 },
  { name: 'Day 25', scans: 2700 },
  { name: 'Day 26', scans: 3000 },
  { name: 'Day 27', scans: 2800 },
  { name: 'Day 28', scans: 3200 },
  { name: 'Day 29', scans: 2500 },
  { name: 'Day 30', scans: 2900 },
];

const ScannedReportChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="scans" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ScannedReportChart;
