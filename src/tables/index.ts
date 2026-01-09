import { Table, z } from "@botpress/runtime";

export default new Table({
  name: 'choiceTable',
  columns: {
    gameId: z.string(),
    choice: z.string(),
    details: z.string(),
    summary: z.string(),
    scene: z.string(),
    choiceNumber: z.number(),
    sceneNumber: z.number(),
  }
})
