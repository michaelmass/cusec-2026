import { Autonomous, z, user, adk } from '@botpress/runtime'

export default new Autonomous.Tool({
  name: 'create_character',
  description: 'Create a new character with name and race. Use this after the player has chosen their character details.',
  input: z.object({
    name: z.string().describe('The character name chosen by the player'),
    race: z.enum(['human', 'elf', 'dwarf', 'hobbit', 'wizard']).describe('The race chosen by the player'),
    background: z
        .enum(["warrior", "ranger", "scholar", "craftsman", "farmer"])
        .optional(),
  }),
  handler: async ({ name, race, background }) => {
    user.state.characterName = name
    user.state.race = race
    user.state.background = background
    user.state.currentLocation = 'shire'

    const stats = await adk.zai.extract(`
Create a new character stats using name and race.

name: ${name}
race: ${race}
background: ${background}

Based on this information approximate the different stats of my character those stats are on a base 100 (maximum).
      `, z.object({
      courage: z.number().min(0).max(100).default(50),
      wisdom: z.number().min(0).max(100).default(50),
      strength: z.number().min(0).max(100).default(50),
      fellowship: z.number().min(0).max(100).default(50),
    }))

    user.state.courage = stats.courage
    user.state.wisdom = stats.wisdom
    user.state.strength = stats.strength
    user.state.fellowship = stats.fellowship
  },
})
