import {
  debounce,
  leading,
  leadingAndTrailing,
} from "@solid-primitives/scheduled"
import { storeDelete, storeList, storeSet } from "engine/api"
import { SearchInteresting } from "engine/api/module"
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

const onUpdateInteresting = debounce(({ prev, next }, key) => {
  for (const _key in next.interests) {
    const key = _key as SearchInteresting

    if (next.interests[key]?.isSelected) {
      if (prev.interests[key]?.isSelected !== next.interests[key]?.isSelected) {
        console.log("SET", key)
        storeSet({ key: "interest", value: key })
      }
    } else {
      console.log("DELETE", key)
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
      console.log("DELETE 2", key)
      storeDelete({ key: "interest", value: key })
    }
  }
}, 1000)

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
      onUpdateInteresting({ prev, next }, key)
    }

    return nextCount <= maxInterest
  },
})
