    if (message && message.type === 'text') {
      const text = message.payload.text

      if (text === '/debug') {
        await conversation.send({
          type: 'text',
          payload: {
            text: JSON.stringify(state)
          }
        })
      } else if (text === '/reset') {
        user.state = {}

        await conversation.send({
          type: 'text',
          payload: {
            text: 'Character Reset!'
          }
        })
      }

      return
    }
