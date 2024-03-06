export default async (ctx, request) => {
  const { params } = request;
  ctx.connection.config.database = params.database;
  return await ctx.connection.execute(`desc ${params.table}`);
};
