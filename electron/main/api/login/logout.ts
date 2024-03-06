export default async (ctx) => {
  ctx.connection.end();
};
