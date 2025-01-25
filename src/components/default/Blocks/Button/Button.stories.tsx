import { type StoryObj, type Meta } from "storybook-solidjs"
import Button from "./Button"

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    mode: {
      control: {
        type: "select",
      },
      options: ["filled", "merges", "outline"],
      description: `
Режим отображения кнопки.

- **filled**: Кнопка заполнена цветом, без границ.
- **merges**: Кнопка сливается с фоном, создавая эффект "заливки".
- **outline**: Кнопка отображается с контуром (обводкой), без заливки.`,
    },
  },
  args: {
    mode: "filled",
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    platform: "iOS",
    children: "Привет, Мир!",
    mode: "merges",
  },
}
