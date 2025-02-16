import path from "path"
import fs from "fs/promises"

async function incrementPackageVersion(
  packageJsonPath: string = "../package.json",
): Promise<string> {
  try {
    // 1. Read the package.json file.
    const filePath = path.resolve(packageJsonPath) // Ensure it's an absolute path
    const fileContent = await fs.readFile(filePath, "utf-8")

    // 2. Parse the JSON content.
    const packageJson = JSON.parse(fileContent)

    // 3. Extract and increment the version.
    if (typeof packageJson.version !== "string") {
      throw new Error(
        'Invalid package.json: Missing or invalid "version" field (must be a string).',
      )
    }

    const versionParts = packageJson.version.split(".")
    if (versionParts.length !== 3) {
      throw new Error(
        "Invalid package.json: Version must be in the format MAJOR.MINOR.PATCH.",
      )
    }

    const major = parseInt(versionParts[0], 10)
    const minor = parseInt(versionParts[1], 10)
    let patch = parseInt(versionParts[2], 10) // Patch is allowed to be NaN initially

    if (isNaN(major) || isNaN(minor)) {
      throw new Error("Major and Minor versions must be valid integers")
    }

    if (isNaN(patch)) {
      patch = 0 // Start at 0 if patch is not a valid number
    } else {
      patch++
    }

    const newVersion = `${major}.${minor}.${patch}`
    packageJson.version = newVersion

    // 4. Write the updated JSON back to the file.  Use a space of 2 for readability
    const updatedContent = JSON.stringify(packageJson, null, 2) + "\n" // Add a newline at the end.
    await fs.writeFile(filePath, updatedContent, "utf-8")

    return newVersion
  } catch (error: any) {
    console.error(`Error incrementing package version: ${error.message}`)
    throw error // Re-throw the error to be handled by the caller.
  }
}

export default incrementPackageVersion
