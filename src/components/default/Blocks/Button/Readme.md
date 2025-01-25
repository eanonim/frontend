## Button

```jsx
const Example = () => {
  return (
    <Button.Group>
      <Button.Group.Container>
        <Button>
          <Button.Icon>
            <IconCheck />
          </Button.Icon>
          <Button.Container>
            <Title>Title</Title>
            <SubTitle>SubTitle</SubTitle>
          </Button.Container>
        </Button>
      </Button.Group.Container>


      <Button.Group.Container>
        <Button>
          <Button.Icon>
            <IconClose />
          </Button.Icon>
          <Button.Container>
            <Title>Title 2</Title>
            <SubTitle>SubTitle 2</SubTitle>
          </Button.Container>
        </Button>
      </Button.Group.Container>
    </Button.Group>
  )
}
```

