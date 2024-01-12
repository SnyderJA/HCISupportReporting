import { request } from '@/templates/utils/request.util';

export const getRequestTypes = async (data: any) => {
  const result = await request({
    url: '/api/jira/request-types',
    method: 'GET',
  });
  return result;
};

export const getAverageTimeToFirstResponse = async ({
  startDate,
  endDate,
  requestTypeName,
}: any) => {
  const result = await request({
    url: '/api/jira/average-time-to-first-response',
    method: 'GET',
    params: { startDate, endDate, requestTypeName },
  });
  return result;
};

export const getAverageTimeToResolution = async ({ startDate, endDate, requestTypeName }: any) => {
  const result = await request({
    url: '/api/jira/average-time-to-resolution',
    method: 'GET',
    params: { startDate, endDate, requestTypeName },
  });
  return result;
};

export const getCountTimeToFirstResponse = async ({ startDate, endDate, requestTypeName }: any) => {
  const result = await request({
    url: '/api/jira/count-time-to-first-response',
    method: 'GET',
    params: { startDate, endDate, requestTypeName },
  });
  return result;
};

export const getCountTimeToResolution = async ({ startDate, endDate, requestTypeName }: any) => {
  const result = await request({
    url: '/api/jira/count-time-to-resolution',
    method: 'GET',
    params: { startDate, endDate, requestTypeName },
  });
  return result;
};

export const getTicketThroughput = async ({ startDate, endDate, requestTypeName }: any) => {
  const result = await request({
    url: '/api/jira/ticket-throughput',
    method: 'GET',
    params: { startDate, endDate, requestTypeName },
  });
  return result;
};

export const getAverageTimeToFirstResponseByDate = async ({
  startDate,
  endDate,
  requestTypeName,
  accountId,
}: any) => {
  const result = await request({
    url: '/api/jira/average-time-to-first-response-by-date',
    method: 'GET',
    params: { startDate, endDate, requestTypeName, accountId },
  });
  return result;
};

export const getAverageTimeToResolutionByDate = async ({
  startDate,
  endDate,
  requestTypeName,
  accountId,
}: any) => {
  const result = await request({
    url: '/api/jira/average-time-to-resolution-by-date',
    method: 'GET',
    params: { startDate, endDate, requestTypeName, accountId },
  });
  return result;
};

export const getCountTimeToFirstResponseByDate = async ({
  startDate,
  endDate,
  requestTypeName,
  accountId,
}: any) => {
  const result = await request({
    url: '/api/jira/count-time-to-first-response-by-date',
    method: 'GET',
    params: { startDate, endDate, requestTypeName, accountId },
  });
  return result;
};

export const getCountTimeToResolutionByDate = async ({
  startDate,
  endDate,
  requestTypeName,
  accountId,
}: any) => {
  const result = await request({
    url: '/api/jira/count-time-to-resolution-by-date',
    method: 'GET',
    params: { startDate, endDate, requestTypeName, accountId },
  });
  return result;
};

export const getAgents = async () => {
  const result = await request({
    url: '/api/jira/agent-status',
    method: 'GET',
  });
  return result;
};

export const updateAgents = async (data: any) => {
  const result = await request({
    url: '/api/jira/agent-status',
    method: 'PUT',
    data: { data },
  });
  return result;
};
