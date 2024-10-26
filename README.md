[![build](https://github.com/vadim-isakov/react-zustand-sugar/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/vadim-isakov/react-zustand-sugar/actions/workflows/build.yml)
[![test](https://github.com/vadim-isakov/react-zustand-sugar/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/vadim-isakov/react-zustand-sugar/actions/workflows/test.yml)
[![lint](https://github.com/vadim-isakov/react-zustand-sugar/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/vadim-isakov/react-zustand-sugar/actions/workflows/lint.yml)
[![Build Size](https://img.shields.io/bundlephobia/minzip/react-zustand-sugar)](https://bundlephobia.com/result?p=react-zustand-sugar)
[![Version](https://img.shields.io/npm/v/react-zustand-sugar)](https://www.npmjs.com/package/react-zustand-sugar)


<p align="center">
  <em>Syntactic sugar around zustand, helping you effortlessly avoid unnecessary re-renders.</em>
</p>

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
      () => store.games.setCurrent(v => v.educational.programming += 1)
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
> Sets initial and current values for multiple keys.

Example: `store.setInitial({ books: 0, toys: 10 });`

---

#### `store.setCurrent(currentValues: Object)`
> Sets current values for multiple keys.

Example: `store.setCurrent({ books: 5, toys: 2 });`

---

#### `store.useCurrent(...keys: Array<string>)`
>  A hook to retrieve the current values of specified properties. If no keys are provided, it returns values for all properties.

Example: `const { books, toys } = store.useCurrent();`

Example: `const { books } = store.useCurrent('books');`

---

#### `store.useSelector(selector: Function)`
>  A hook to retrieve the values by using selector.

Example: `const totalItems = store.useSelector(store => store.book + store.toys);`

Example:
```jsx
const currentState = store.useSelector();
const totalItems = currentState.books = currentState.toys;
```

---

#### `store.useResetOnUnmount()`
> Hook to reset values on unmount.

Example: `store.useResetOnUnmount();`

---

#### `store.reset()`
> Resets current values to their initial values.

Example: `store.reset();`

---

#### `store.yourValue`
> Accesses the current value of a specific store property.

Example: `const currentBooks = store.books;`

---

#### `store.yourValue = value`
> Sets the current value of a specific store property.

Example: `store.books = 5;`

---

#### `store.yourValue.useCurrent(selector?: Function)`
> Hook to get the current value of a specific store property.

Example: `const currentBooks = store.books.useCurrent();`

Example: `const currentBooksExist = store.books.useCurrent(v => v > 0);`

---

#### `store.yourValue.setCurrent(functionOrValue)`
> Sets the current value of a specific store property. Accepts either a direct value to set or an updater function to modify the current value.

Example: `store.books.setCurrent(books => books + 1);`

Example: `store.books.setCurrent(2);`

---

#### `store.yourValue.reset()`
> Resets the current value of a specific store property to its initial value.

Example: `store.books.reset();`
