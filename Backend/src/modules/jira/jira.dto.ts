import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsBoolean,
  IsDate,
  ValidateIf,
  ValidateNested,
  ArrayMinSize,
  IsEnum,
} from 'class-validator';
import { SUPPORT_PERCENTAGE_ENUM } from 'src/constants';

export class DateDto {
  @ApiProperty({ format: 'YYYY-MM-DD', example: '2023-04-01' })
  @IsDateString()
  @IsNotEmpty()
  readonly startDate: string;

  @ApiProperty({
    format: 'YYYY-MM-DD',
    example: '2023-04-02',
    description: 'EndData must be greater than StartDate',
  })
  @IsDateString()
  @IsNotEmpty()
  readonly endDate: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly accountId?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',');
    return value;
  })
  readonly requestTypeName?: string[];
}

export class UserParamsDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly query?: string;

  @ApiProperty({ required: false, type: 'number' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  readonly startAt?: number;

  @ApiProperty({ required: false, type: 'number' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  readonly maxResults?: number;
}

export class AgentStatusRequestDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  agentId: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  agentName: string;

  @ApiProperty({ required: true })
  @IsEnum(SUPPORT_PERCENTAGE_ENUM)
  @IsNotEmpty()
  supportPercentage: SUPPORT_PERCENTAGE_ENUM;

  // @ApiProperty({ required: true })
  // @IsNumber()
  // @IsNotEmpty()
  // @Max(100)
  // projectPercentage: number;

  @ApiProperty({
    format: 'YYYY-MM-DD',
    example: '2023-04-02',
    description: 'EndData must be greater than StartDate',
    required: false,
  })
  @IsDate()
  @ValidateIf((o) => !!o.projectPercentage)
  @IsNotEmpty()
  projectEndDate?: Date | null;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  defaultToSupport?: boolean | null;

  @ApiProperty({ required: true })
  @IsBoolean()
  @IsOptional()
  includeInReport?: boolean | null;
}

export class AgentStatusBodyDto {
  @ApiProperty({ required: true })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AgentStatusRequestDto)
  data: AgentStatusRequestDto[];
}

export class AgentStatusDto extends AgentStatusRequestDto {
  projectPercentage: number;
}
