import { SearchInteresting } from "engine/api/module"
import { setter, atom } from "engine/modules/smart-data"

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
  interests: Partial<
    Record<SearchInteresting, { isSelected: boolean; isHidden?: boolean }>
  >
}

export const SEARCH_OPTIONS_ATOM = atom<
  SearchOptionsAtom,
  {},
  "default" | "edit"
>({
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
    interests: {
      animals: {
        isSelected: true,
      },
      anime: {
        isSelected: true,
      },
      art: {
        isSelected: true,
      },
      science: {
        isSelected: true,
      },
      fashion: {
        isSelected: true,
      },
    },
  },
  updateIntervalMs: 60_000,
  onUpdate: ({ prev, next }, key) => {
    const nextCount = Object.values(next.interests).filter(
      (x) => x.isSelected,
    ).length

    if (nextCount > 5) {
      setter([SEARCH_OPTIONS_ATOM, key], prev)
    }
  },
})
