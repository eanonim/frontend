import { type Accessor, createMemo } from "solid-js"

import { atom, getter, setter, globalSignal } from "elum-state/solid"
import {
  type Flatten,
  type NullableTranslator,
  type ResolveArgs,
  type Resolved,
  type BaseRecordDict,
  flatten,
  resolveTemplate,
  translator,
} from "./module"

/**
 * Импорт языков
 */
import ru from "./data/ru"
import en from "./data/en"

export const ISOLanguage = {
  ru: "RU-ru",
  en: "EN-en",
}

export type Locale = "ru" | "en"
export type RawDictionary = typeof ru & typeof en
export type Dictionary = Flatten<RawDictionary>

export const dictionaries = { ru, en }

const rtl: Locale[] = []

const LOC = atom<Locale>({
  key: "localization_app",
  default: "en",
})

export const getLocale = () => getter(LOC)

export type NullableTranslatorByCode<T extends BaseRecordDict, O = string> = <
  K extends keyof T,
>(
  code: Locale,
  path: K,
  ...args: ResolveArgs<T[K], O>
) => Resolved<T[K], O> | undefined

export const locByCode = () => {
  const [locale] = globalSignal<Locale>(LOC)

  const get: NullableTranslatorByCode<Dictionary> = (code, path, ...args) => {
    const dict = createMemo(() => flatten(dictionaries[code])) as any

    return translator(dict, resolveTemplate)(path, ...args) as any
  }

  return [get, locale] as [
    NullableTranslatorByCode<Dictionary>,
    Accessor<Locale>,
  ]
}

export const getLoc = translator(
  () => flatten(dictionaries[getLocale()]),
  resolveTemplate,
)

const loc = () => {
  const [locale] = globalSignal<Locale>(LOC)
  const dict = createMemo(() => flatten(dictionaries[locale()]))

  return [translator(dict, resolveTemplate), locale] as [
    NullableTranslator<Dictionary>,
    Accessor<Locale>,
  ]
}

export const swap = (_locale: Locale) => {
  var locale = _locale.split("-")?.[0] as Locale

  /**
   * Default language
   */
  if (!dictionaries[locale]) locale = "en"

  // locale = "en"
  document.documentElement.setAttribute("lang", locale)
  document.documentElement.setAttribute(
    "dir",
    rtl.includes(locale) ? "rtl" : "ltr",
  )
  setter(LOC, locale)
}

export default loc
