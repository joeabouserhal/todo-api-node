const z = require("zod");

const Task = z.object({
  title: z.string(),
  description: z.string().optional(),
});

module.exports = Task;
