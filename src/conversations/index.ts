import { Conversation } from '@botpress/runtime'
import world from '../knowledge'

export default new Conversation({
  channel: 'chat.channel',
  handler: async ({ execute }) => {
    await execute({
      instructions: 'anwser any question related to the world using the knowledge base',
      objects: [],
      mode: 'chat',
      knowledge: [world]
    })
  }
})
