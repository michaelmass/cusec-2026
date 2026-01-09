import { Conversation, user, actions } from "@botpress/runtime";
import createCharacter from "../tools/createCharacter";
import makeChoice from "../tools/makeChoice";
import completeScene from "../tools/completeScene";
import finishGame from "../tools/finishGame";

export default new Conversation({
  channel: 'webchat.channel',
  handler: async ({ execute, message, conversation }) => {
    const state = user.state

    if (message && message.type === 'text') {
      const text = message.payload.text

      if (text === '/debug') {
        await conversation.send({
          type: 'text',
          payload: {
            text: JSON.stringify(state)
          }
        })
        return
      } else if (text === '/reset') {
        user.state = {}

        await conversation.send({
          type: 'text',
          payload: {
            text: 'Character Reset!'
          }
        })
        return
      }
    }

    if (!state.characterName) {
      await execute({
        instructions: `
You are a friendly character creation assistant for a Lord of the Rings adventure game.

The user will tell you their character details. Extract their:
- Name
- Race (human, elf, dwarf, hobbit, or wizard)
- Background (warrior, ranger, scholar, craftsman, or farmer)

When you have all three pieces of information, call the create_character tool.

If the user has just greeted you or asked to start, welcome them warmly and ask for their character details.
If they provide incomplete information, ask them politely for what is missing.

Be encouraging and excited about their choices!`,
        mode: 'chat',
        tools: [createCharacter]
      })

      if (state.characterName) {
        const { imageUrl } = await actions.openai.generateImage({
          prompt: `
Generate an avatar of this character:

**${state.characterName}** - *${state.race}* (${state.background})

The image must be as creative as possible. Showcase the avatar of the character in action.

NO TEXT ONLY AN IMAGE.`
        })

        state.avatarUrl = imageUrl

        await conversation.send({
          type: 'text',
          payload: {
            text: `**Character Created!**

**${state.characterName}** - *${state.race}* (${state.background})

**Starting Stats:**
• Courage: ${state.courage}/100
• Wisdom: ${state.wisdom}/100
• Strength: ${state.strength}/100
• Fellowship: ${state.fellowship}/100

![Character Avatar](${imageUrl})

Your adventure begins...`
          }
        })
      }

      return
    }

    if (!state.gameOver) {
      await execute({
        mode: 'chat',
        tools: [makeChoice, completeScene, finishGame],
        instructions: `
You are an immersive narrator for ${state.characterName}, a ${state.race} ${state.background}.

**Current Stats:**
- Courage: ${state.courage}/100
- Wisdom: ${state.wisdom}/100
- Strength: ${state.strength}/100
- Fellowship: ${state.fellowship}/100

**Summary**:
${state.summary}

**Location**
${state.currentLocation}

**Scene**
${state.scene}

Make sure to prevent directly going to the end of the story. Create a story that is 1 scene long.
The user has completed ${state.sceneCompletedCount} scenes.
${(state.sceneCompletedCount ?? 0) > 1 ? 'FINISH THE STORY AS SOON AS POSSIBLE. THIS WILL BE THE LAST SCENE!!' : ''}

A single scene must be around 4 to 5 choices.
${state.choicesMadeCurrentScene} choices made so far.
${(state.choicesMadeCurrentScene ?? 0) > 5 ? 'FINISH THE SCENE AS SOON AS POSSIBLE' : ''}
${(state.choicesMadeCurrentScene ?? 0) > 7 ? 'MAKE A DRASTIC RANDOM EVENT TO FINISH THE SCENE NOW!!!' : ''}

Narrate this scene with short Tolkien-esque prose. Extract the choice of the player for the current scene.
ONLY advance the scene through the choice tool. DON'T continue the story unless you use the choice tool.

Allow the player to make his own choice.
ALWAYS offer a choice that is extremely bold to players.`,
})
return
    }

    if (state.gameOver) {
      if (state.gameState) {
        await conversation.send({
          type: 'text',
          payload: {
            text: `You **${state.gameState}** the game`
          }
        })
      }

      await execute({
        mode: 'chat',
        instructions: `
You are an immersive narrator for ${state.characterName}, a ${state.race} ${state.background}. The game is over, tell the player how he did and a summary of what happened.

**Current Stats:**
- Courage: ${state.courage}/100
- Wisdom: ${state.wisdom}/100
- Strength: ${state.strength}/100
- Fellowship: ${state.fellowship}/100

**Summary**:
${state.summary}

**Location**
${state.currentLocation}

**Scene**
${state.scene}`
      })
      return
    }
  }
})
