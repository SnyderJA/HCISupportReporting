import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import Spin from '@/templates/components/Spin';
import { CustomXAxisTick } from './CustomXAxisTick';
import { ChartNoData } from './ChartNoData';

export const CountTimeLineChart = ({ title, useServiceData, onClick }: any) => {
  return (
    <div style={{ width: '100%', height: '100%', marginBottom: 40 }}>
      <div style={{ height: 400 }}>
        <Spin spinning={useServiceData.loading}>
          <ChartNoData loading={useServiceData.loading} data={useServiceData.value || []} />
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={useServiceData.value || []}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              onClick={(item: any) => {
                onClick && onClick(item.activePayload[0].payload);
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayName" tick={<CustomXAxisTick />} interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalBreached" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="totalCompleted" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Spin>
      </div>
      <p style={{ textAlign: 'center' }}>{title}</p>
    </div>
  );
};
