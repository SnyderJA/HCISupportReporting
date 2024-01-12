import { Text } from 'recharts';

export const CustomXAxisTick = ({ x, y, payload }: any) => {
  if (payload && payload.value) {
    return (
      <Text fontSize={'12px'} width={'12px'} x={x} y={y} textAnchor="middle" verticalAnchor="start">
        {payload.value}
      </Text>
    );
  }
  return null;
};
