import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Spin from '@/templates/components/Spin';
import { CustomXAxisTick } from './CustomXAxisTick';
import { ChartNoData } from './ChartNoData';

export const AverageTimeBarChart = ({
  useServiceData,
  title,
  barDataKey,
  convertValues,
  yAxisLabel,
  barUnit,
  onClick,
  TooltipContent
}: any) => {
  const getData = () => {
    if (!convertValues) {
      return useServiceData?.value || [];
    }
    return convertValues(useServiceData?.value) || [];
  };
  return (
    <div style={{ width: '100%', height: '100%', marginBottom: 40 }}>
      <div style={{ height: 400 }}>
        <Spin spinning={useServiceData.loading}>
          <ChartNoData loading={useServiceData.loading} data={getData()} />
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={getData() || []}
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
              <YAxis label={yAxisLabel} />
              <Tooltip content={TooltipContent ? <TooltipContent/>: undefined} />
              <Legend />
              <Bar dataKey={barDataKey} fill="#8884d8" unit={barUnit} />
            </BarChart>
          </ResponsiveContainer>
        </Spin>
      </div>
      <p style={{ textAlign: 'center' }}>{title}</p>
    </div>
  );
};
