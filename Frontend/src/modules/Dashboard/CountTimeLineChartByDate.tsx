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
import { strDateReqToStrUi, stringParamReqToDate } from '@/templates/utils/format.util';
import { CustomXAxisTickDate } from './CustomXAxisTickDate';
import styles from './Dashboard.module.scss';

export const CountTimeLineChartByDate = ({ title, useServiceData, startDate, endDate }: any) => {
  const data = (() => {
    const values = useServiceData.value || [];
    if (!values) {
      return [];
    }
    const objectMap = values.reduce((obj: any, item: any) => {
      obj[item.date] = {
        ...item,
      };
      return obj;
    }, {});
    const frequency = [];
    for (
      var m = stringParamReqToDate(startDate);
      m?.isBefore(stringParamReqToDate(endDate));
      m.add(1, 'day')
    ) {
      const date = m.format('YYYY-MM-DD');
      if (objectMap[date]) {
        frequency.push(objectMap[date]);
      } else {
        frequency.push({
          date,
          totalBreached: 0,
          totalCompleted: 0,
        });
      }
    }
    return frequency;
  })().map((item: any) => {
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
        <Spin spinning={useServiceData.loading}>
          <ResponsiveContainer width={Math.max(data.length * 40, 400)} height="100%">
            <LineChart
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
