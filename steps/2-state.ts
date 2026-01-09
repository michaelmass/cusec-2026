import { z, defineConfig } from "@botpress/runtime";

export default defineConfig({
  name: "BYOA",
  description: "An AI agent built with Botpress ADK",

  bot: {
    state: z.object({}),
  },

  user: {
    state: z.object({
      characterName: z.string().optional(),
      race: z.enum(["human", "elf", "dwarf", "hobbit", "wizard"]).optional(),
      background: z
        .enum(["warrior", "ranger", "scholar", "craftsman", "farmer"])
        .optional(),
      avatarUrl: z.string().optional(),

      courage: z.number().min(0).max(100).default(50).optional(),
      wisdom: z.number().min(0).max(100).default(50).optional(),
      strength: z.number().min(0).max(100).default(50).optional(),
      fellowship: z.number().min(0).max(100).default(50).optional(),

      currentLocation: z.string().default("shire").optional(),
      summary: z.string().optional(),
      scene: z.string().optional(),
      sceneCompletedCount: z.number().default(0).optional(),
      choicesMadeCurrentScene: z.number().default(0).optional(),

      health: z.number().min(0).max(100).default(100).optional(),

      gameOver: z.boolean().default(false).optional(),
      gameState: z.enum(['won', 'lost']).optional(),
    }),
  },

  dependencies: {
    integrations: {
      webchat: { version: "webchat@0.3.0", enabled: true },
      openai: { version: "openai@18.0.0", enabled: true },
    },
  },
});
