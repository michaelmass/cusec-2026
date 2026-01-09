import { Autonomous, z, user, adk, actions, context } from '@botpress/runtime'

export default new Autonomous.Tool({
  name: 'complete_scene',
  description: 'Complete the current scene.',
  input: z.object({
    sceneSummary: z.string(),
  }),
  handler: async ({ sceneSummary }) => {
    const state = user.state

    const chat = context.get('chat')

    const { imageUrl } = await actions.openai.generateImage({
      prompt: `
Generate an image for a scene in a story of this character named ${state.characterName}, a ${state.race} ${state.background}.

NO TEXT ONLY AN IMAGE.

Scene:
${sceneSummary}
`
    })

    await chat.sendMessage({
      type: 'text',
      payload: {
        text: `Scene Completed!\n![](${imageUrl})`
      }
    })

    const res = await adk.zai.extract(`
You are an immersive narrator for ${state.characterName}, a ${state.race} ${state.background}. The user completed a scene generate the next scene the user will need to complete.

Here's the details of the story so far.

**Summary**:
${state.summary}

**Location**
${state.currentLocation}

**Scene**
${state.scene}

**Scene Summary**
${sceneSummary}

Make sure to prevent directly going to the end of the story. The story must have continuity.

Narrate this scene with rich Tolkien-esque prose.
      `, z.object({
        nextScene: z.string().describe('Description of the next scene'),
      }))

    user.state.scene = res.nextScene
    user.state.sceneCompletedCount = (user.state.sceneCompletedCount ?? 0) + 1
    user.state.choicesMadeCurrentScene = 0
  },
})
