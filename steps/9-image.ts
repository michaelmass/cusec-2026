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
