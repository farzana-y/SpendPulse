export const pricing = {
  Cursor: {
    Hobby: 0,
    Pro: 20,
    "Pro+": 60,
    Ultra: 200,
    Teams: 40,
    Enterprise: 0,
  },

  Copilot: {
    Free: 0,
    Pro: 10,
    "Pro+": 39,
    Business: 19,
    Enterprise: 39,
  },

  Claude: {
    Free: 0,
    Pro: 17,
    Max: 100,
    "Team Standard": 20,
    Enterprise: 20,

    API: {
      "Opus 4.7": {
        input: 5,
        output: 25,
      },

      "Sonnet 4.6": {
        input: 3,
        output: 15,
      },

      "Haiku 4.5": {
        input: 1,
        output: 5,
      },
    },
  },

  ChatGPT: {
    Free: 0,
    Plus: 20,
    Pro: 200,
    Team: 30,
    Enterprise: 0,

    API: {
      "GPT-5.5": {
        input: 5,
        output: 30,
      },

      "GPT-5.4": {
        input: 2.5,
        output: 15,
      },

      "GPT-5.4 Mini": {
        input: 2.5,
        output: 15,
      },

      "GPT-5.4 Nano": {
        input: 0.2,
        output: 1.25,
      },

      o3: {
        input: 3.5,
        output: 14,
      },

      "o4-mini": {
        input: 2,
        output: 8,
      },
    },
  },

  Gemini: {
    Free: 0,
    "AI Plus": 7.99,
    "AI Pro": 19.99,
    "AI Ultra": 249.99,
  },

  v0: {
    Free: 0,
    Team: 30,
    Business: 100,
    Enterprise: 0,
  },
};