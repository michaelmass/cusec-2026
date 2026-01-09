import { Autonomous, z, user, adk, actions } from '@botpress/runtime'

export default new Autonomous.Tool({
  name: 'end_game',
  description: 'End the game. When the user dies or compelete the quest.',
  input: z.object({
    gameState: z.enum(['won', 'lost']),
  }),
  handler: async ({ gameState }) => {
    const state = user.state

    state.gameOver = true
    state.gameState = gameState

    const value = await adk.zai.extract(`
You are an immersive narrator for ${state.characterName}, a ${state.race} ${state.background}. The user completed the game generate a summary of the entire story.

Here's the details of the story:

THE GAME IS ${gameState}

**Summary**:
${state.summary}

**Location**
${state.currentLocation}

**Scene**
${state.scene}
      `, z.object({
      summary: z.string()
    }))

    const e = await actions.openai.generateImage({
      prompt: `
Generate an image for the end of a game. The user ${gameState} the game.
NO TEXT ONLY AN IMAGE.

The character: ${state.characterName}, a ${state.race} ${state.background}.

Here's the summary:
${value.summary}
`
    })

    state.summary = value.summary
  },
})
