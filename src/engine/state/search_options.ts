import { storeDelete, storeList, storeSet } from "engine/api"
import { SearchInteresting, Socket } from "engine/api/module"
import { atom } from "engine/modules/smart-data"
import { maxInterest } from "root/configs"

type SearchOptionsAtom = {
  you: {
    male: "man" | "woman"
    age: {
      from: number
      to: number
    }
  }
  companion: {
    male: "man" | "woman" | "any"
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
    interests: {},
  },
  updateIntervalMs: 60_000,
  onRequested: (options, key) => {
    storeList(options)
  },
  onUpdate: async ({ prev, next }, key) => {
    const nextCount = Object.values(next.interests).filter(
      (x) => x.isSelected,
    ).length

    if (key === "default") {
      for (const _key in next.interests) {
        const key = _key as SearchInteresting

        if (next.interests[key]?.isSelected) {
          if (
            prev.interests[key]?.isSelected !== next.interests[key]?.isSelected
          ) {
            storeSet({ key: "interest", value: key })
          }
        } else {
          storeDelete({ key: "interest", value: key })
        }
      }
      for (const _key in prev.interests) {
        const key = _key as SearchInteresting

        if (
          !next.interests[key] &&
          !!prev.interests[key] &&
          prev.interests[key]?.isSelected
        ) {
          storeDelete({ key: "interest", value: key })
        }
      }

      if (prev.companion.age.to !== next.companion.age.to) {
        storeSet({ key: "filterYourAgeEnd", value: next.companion.age.to })
      }

      if (prev.companion.age.from !== next.companion.age.from) {
        storeSet({
          key: "filterYourAgeStart",
          value: next.companion.age.from,
        })
      }

      if (prev.companion.male !== next.companion.male) {
        storeSet({ key: "filterYourSex", value: next.companion.male })
      }

      if (prev.you.male !== next.you.male) {
        storeSet({ key: "filterMySex", value: next.you.male })
      }

      if (prev.you.age.from !== next.you.age.from) {
        storeSet({ key: "filterMyAge", value: next.you.age.from })
      }
    }

    return nextCount <= maxInterest
  },
})
