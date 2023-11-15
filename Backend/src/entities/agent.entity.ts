import { Max, Min } from 'class-validator';
import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  Unique,
  CreatedAt,
  UpdatedAt,
  AllowNull,
} from 'sequelize-typescript';
import * as uuid from 'uuid';

@Table({
  tableName: 'AgentStatus',
  freezeTableName: true,
})
export class AgentStatus extends Model<AgentStatus> {
  @PrimaryKey
  @Unique
  @Default(() => uuid.v4()) // need use event beforeCreate
  @Column(DataType.UUIDV4)
  id: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  agentId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  agentName: string;

  @Max(100)
  @Min(0)
  @AllowNull(false)
  @Column(DataType.FLOAT)
  supportPercentage: number;

  @Max(100)
  @Min(0)
  @AllowNull(false)
  @Column(DataType.FLOAT)
  projectPercentage: number;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  projectEndDate?: Date | null;

  @AllowNull(true)
  @Default(false)
  @Column(DataType.BOOLEAN)
  defaultToSupport?: boolean | null;

  @AllowNull(true)
  @Default(false)
  @Column(DataType.BOOLEAN)
  includeInReport?: boolean | null;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;
}
