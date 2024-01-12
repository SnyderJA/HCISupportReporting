import { Text } from 'recharts';

export const CustomXAxisTickDate = ({ x, y, payload }: any) => {
  if (payload && payload.value) {
    return (
      <Text
        fontSize={'11px'}
        width={'11px'}
        x={x}
        y={y}
        textAnchor="end"
        angle={-45}
        verticalAnchor="start"
      >
        {payload.value}
      </Text>
    );
  }
  return null;
};
