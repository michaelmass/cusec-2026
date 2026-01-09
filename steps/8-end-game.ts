
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
You are an immersive narrator for ${state.characterName}, a ${state.race} ${state.background}.
The game is over, tell the player how he did and a summary of what happened.

**Current Stats:**
- Courage: ${state.courage}/100
- Wisdom: ${state.wisdom}/100
- Strength: ${state.strength}/100
- Fellowship: ${state.fellowship}/100

**Summary**:
${state.summary}`
      })
      return
    }
