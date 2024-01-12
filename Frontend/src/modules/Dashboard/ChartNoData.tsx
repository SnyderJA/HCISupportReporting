export const ChartNoData = ({ loading, data }: any) => {
  if (loading || data.length !== 0) {
    return null;
  }
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1000,
      }}
    >
      <p
        style={{
          margin: 0,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        There is no data found
      </p>
    </div>
  );
};
