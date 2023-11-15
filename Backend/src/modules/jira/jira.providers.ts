import { AGENT_STATUS_REPOSITORY } from 'src/constants/repository.constants';
import { AgentStatus } from 'src/entities/agent.entity';

export const jirasProviders = [
  {
    provide: AGENT_STATUS_REPOSITORY,
    useValue: AgentStatus,
  },
];
