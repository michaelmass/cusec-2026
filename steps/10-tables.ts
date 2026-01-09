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

    await choiceTable.createRows({
      rows: [
        {
          gameId: `${state.characterName}-${state.race}-${state.background}`,
          choice,
          details,
          summary: state.summary ?? '',
          scene: state.scene ?? '',
          choiceNumber: user.state.choicesMadeCurrentScene ?? 0,
          sceneNumber: user.state.sceneCompletedCount ?? 0,
        }
      ]
    }).catch(() => { })
