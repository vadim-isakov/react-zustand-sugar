# react-zustand-sugar – Cut Down ReactJS Re-renders with No Hassle

> This library is syntactic sugar around [zustand](https://github.com/pmndrs/zustand), helping you effortlessly avoid unnecessary re-renders.

## Install
This library requires the following packages to be installed:

- [zustand](https://github.com/pmndrs/zustand)
- [mutative](https://github.com/unadlib/mutative)

You can install them together with:

```sh
npm install zustand mutative react-zustand-sugar
```


## Usage
In the examples below, we update child components from the parent without re-rendering the parent component.

#### Simple example

```jsx
import { create } from 'react-zustand-sugar';

const store = create({book: 0, toys: 0});


export default function Parent() {
  store.useResetOnUnmount();

  return <div>
    <button onClick={() => store.books.current += 1}>Add book</button>
    <Books/>
    <button onClick={() => store.toys.current += 1}>Add toy</button>
    <Toys/>
  </div>
}

function Books() {
  const books = store.books.useCurrent()
  return <div>{books}</div>   
}

function Toys() {
  const toys = store.toys.useCurrent()
  return <div>{toys}</div>
}
```


#### Example with nested state
```jsx
const store = create({
  books: 0,
  games: {
    educational: {
      programming: 0,
      physics: 0,
    },
    shooters: 0,
  },
});

export default function Parent() {
  store.useResetOnUnmount();

  return <div>
    <button onClick={() => store.books.current += 1}>Add book</button>
    <Books/>
    <button onClick={
      () => store.games.useCurrent(v => v.educational.programming += 1)
    }>Add programming games"</button>
    <Toys/>
  </div>
}

function Books() {
  const value = store.books.useCurrent()
  return <div>{value}</div>   
}

function ProgrammingGames() {
  const value = store.games.useCurrent(games => games.educational.programming)
  return <div>{value}</div>
}
```

## Instructions for Using the Package

### 1. Create the store and define initial values
```js
const store = create({book: 0, toys: 0});
```

### 2. Reset Current Values
- Automatically reset all values on unmount: `store.useResetOnUnmount();`
- Reset all values: `store.reset();`
- Reset a single value: `store.books.reset();`

### 3. Set Current Values
- Set a specific value: `store.books.current = value;`
- Set multiple values at once: `store.setCurrent({ books: 5, toys: 5 });`
- Update a value using a selector: `store.educational.setCurrent(educational => educational.programming += 10);`

### 4. Get Current Values
- Use a hook to retrieve the current value: `store.educational.useCurrent(educational => educational.programming);`
- Access the current value directl: `store.educational.current;`



## API
### API Documentation

#### `store.setInitial(initialValues: Object)`
Sets initial and current values for multiple keys.
- Example: `store.setInitial({ books: 0, toys: 10 });`

#### `store.setCurrent(currentValues: Object)`
Sets current values for multiple keys.
- Example: `store.setCurrent({ books: 5, toys: 2 });`

#### `store.useResetOnUnmount()`
Hook to reset values on unmount.
- Example: `store.useResetOnUnmount();`

#### `store.reset()`
Resets current values to their initial values.
- Example: `store.reset();`

#### `store.yourValue`
Accesses the current value of a specific store property.
- Example: `const currentBooks = store.books;`

#### `store.yourValue = value`
Sets the current value of a specific store property.
- Example: `store.books = 5;`

#### `store.yourValue.useCurrent(selector?: Function)`
Hook to get the current value of a specific store property.
- Example: `const currentBooks = store.books.useCurrent();`

#### `store.yourValue.setCurrent(updater: Function)`
Sets the current value of a specific store property using an updater function.
- Example: `store.books.setCurrent(books => books + 1);`

#### `store.yourValue.reset()`
Resets the current value of a specific store property to its initial value.
- Example: `store.books.reset();`
