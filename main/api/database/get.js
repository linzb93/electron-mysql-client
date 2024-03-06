export default async (ctx) => {
  return await ctx.connection.execute("show databases");
};
