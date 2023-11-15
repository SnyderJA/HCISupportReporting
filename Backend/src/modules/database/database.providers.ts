import { Sequelize } from 'sequelize-typescript';
import { AgentStatus } from 'src/entities/agent.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: 'database/db.sqlite',
      });
      sequelize.addModels([AgentStatus]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
