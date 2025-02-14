import { atom } from "engine/modules/smart-data"

type SearchOptionsAtom = {
  you: {
    male: "man" | "woman"
    age: {
      from: number
      to: number
    }
  }
  companion: {
    male: "man" | "woman"
    age: {
      from: number
      to: number
    }
  }
  themes: (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10)[]
}

export const SEARCH_OPTIONS_ATOM = atom<SearchOptionsAtom, {}>({
  default: {
    you: {
      male: "man",
      age: {
        from: 18,
        to: 24,
      },
    },
    companion: {
      male: "man",
      age: {
        from: 18,
        to: 24,
      },
    },
    themes: [1, 2, 3, 4, 10],
  },
  updateIntervalMs: 60_000,
})
