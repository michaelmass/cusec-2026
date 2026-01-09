    if (!state.characterName) {
      await execute({
        instructions: `
You are a friendly character creation assistant for a Lord of the Rings adventure game.

The user will tell you their character details. Extract their:
- Name
- Race (human, elf, dwarf, hobbit, or wizard)
- Background (warrior, ranger, scholar, craftsman, or farmer)

When you have all three pieces of information, call the create_character tool.

If the user just greeted you or asked to start, welcome them warmly and ask for their character details.
If they provide incomplete information, ask them politely for what's missing.

Be encouraging and excited about their choices!`,
        mode: 'chat',
        // tools: [createCharacter]
      })

      if (state.characterName) {
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

Your adventure begins...`
          }
        })
      }

      return
    }
