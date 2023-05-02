const z = require("zod");

const Task = z.object({
  title: z.string(),
  description: z.string().optional(),
  date_created: z.date().optional(),
});

module.exports = Task;
