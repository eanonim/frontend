import { type Platform } from "@ui/Types"
import { type Property } from "csstype"
/// values[typeof platform === "function" ? platform() : platform]

type GapCount = Property.Gap<(string & {}) | 0>

const generateGap = (
  values: Record<"count", Record<Platform, GapCount>>,
  platform: Platform | (() => Platform),
) => {
  const valuePlatform = typeof platform === "function" ? platform() : platform

  return { count: values?.count[valuePlatform] }
}

export default generateGap
