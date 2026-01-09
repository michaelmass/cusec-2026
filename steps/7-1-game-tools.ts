import { Autonomous, z, user, adk } from '@botpress/runtime'

export default new Autonomous.Tool({
  name: 'make_choice',
  description: 'Make a choice on the current scene.',
  input: z.object({
    choice: z.string().describe('Choice of the user'),
    details: z.string().describe('Important information about the choice')
  }),
  output: z.object({
    state: z.object({}),
    result: z.object({}),
  }),
  handler: async ({ choice, details }) => {
    const state = user.state

    const res = await adk.zai.extract(`
You are an immersive narrator for ${state.characterName}, a ${state.race} ${state.background}.

**Current Stats:**
- Courage: ${state.courage}/100
- Wisdom: ${state.wisdom}/100
- Strength: ${state.strength}/100
- Fellowship: ${state.fellowship}/100

**User Health**
${state.health}

**Summary**:
${state.summary}

**Location**
${state.currentLocation}

**Scene**
${state.scene}

Make sure to prevent directly going to the end of the story. The story must have continuity.

DON'T MAKE the game too easier if the player makes the wrong move he can lose the game.

Narrate this scene with rich Tolkien-esque prose.

USER CHOICE:
${choice}

${details}
      `, z.object({
        health: z.number().describe('Reminding health of the User after this choice. 0 means gameOver'),
        currentLocation: z.string().describe('set the current location if the location changed with this choice').optional(),
        newSummary: z.string().describe('new summary for the story'),
        isSceneCompleted: z.boolean().describe('If the scene is completed'),
      }))

    if (res.currentLocation) {
      user.state.currentLocation = res.currentLocation
    }

    user.state.health = res.health
    user.state.summary = res.newSummary
    user.state.choicesMadeCurrentScene = (user.state.choicesMadeCurrentScene ?? 0) + 1

    return {
      state: user.state,
      result: res
    }
  },
})
