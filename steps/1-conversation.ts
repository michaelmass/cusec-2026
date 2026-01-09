import { Conversation } from "@botpress/runtime";

export default new Conversation({
  channel: 'webchat.channel',
  handler: async ({ execute }) => {
    await execute({
      instructions: 'great the user',
      mode: 'chat',
    })
  }
})
