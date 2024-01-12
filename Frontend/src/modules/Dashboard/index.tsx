import { Tabs } from 'antd';
import { SLAMetrics } from './SLAMetrics';
import { TicketThroughput } from './TicketThroughput';
import { AgentStatus } from './AgentStatus';

const Dashboard = () => {
  return (
    <>
      <Tabs>
        <Tabs.TabPane tab="SLA metrics" key="SLA-metrics">
          <SLAMetrics />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Ticket throughput" key="Ticket throughput">
          <TicketThroughput />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Agent Status" key="Agent Status">
          <AgentStatus />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default Dashboard;
