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
import { CustomXAxisTickDate } from './CustomXAxisTickDate';
import styles from './Dashboard.module.scss';
import { strDateReqToStrUi } from '@/templates/utils/format.util';
import { ChartNoData } from './ChartNoData';

export const AverageTimeBarChartByDate = ({
  useServiceData,
  title,
  barDataKey,
  convertValues,
  yAxisLabel,
  barUnit,
  onClick,
}: any) => {
  const getData = () => {
    if (!convertValues) {
      return useServiceData?.value;
    }
    return convertValues(useServiceData?.value);
  };
  const data = (getData() || []).map((item: any) => {
    return {
      ...item,
      date: strDateReqToStrUi(item.date),
    };
  });
  return (
    <div style={{ width: '100%', height: '100%', marginBottom: 40, marginTop: 40 }}>
      <div
        className={`${styles.chartDetail} chartDetail`}
        style={{ height: 400, overflowX: 'scroll', overflowY: 'hidden' }}
        onScroll={(e: any) => {
          let ele = document.querySelector('.chartDetail .recharts-yAxis') as any;
          try {
            ele.style = 'transform: translateX(' + e.target.scrollLeft + 'px);';
          } catch (e) {
            console.error(e);
          }
        }}
      >
        <Spin style={{}} spinning={useServiceData.loading}>
          <ChartNoData loading={useServiceData.loading} data={getData()} />
          <ResponsiveContainer width={Math.max(data.length * 50, 400)} height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" height={60} tick={<CustomXAxisTickDate />} interval={0} />
              <YAxis label={yAxisLabel} />
              <Tooltip />
              <Legend />
              <Bar
                onClick={(item) => {
                  onClick && onClick(item);
                }}
                dataKey={barDataKey}
                fill="#8884d8"
                unit={barUnit}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </Spin>
      </div>
      <p style={{ textAlign: 'center' }}>{title}</p>
    </div>
  );
};
