### API Documentation

#### `store.setInitial(initialValues: object)`
> Sets initial and current values for multiple keys.

Example:
```jsx
store.setInitial({ books: 0, toys: 10 });
```

---

#### `store.setCurrent(currentValues: object)`
> Sets current values for multiple keys.

Example:
```jsx
store.setCurrent({ books: 5, toys: 2 });
```

---

#### `store.getCurrent(...keys: string[])`
>  Retrieves the current values of the specified keys. If no keys are provided, it returns all keys.

Examples:
```jsx
const { books, toys } = store.getCurrent();
```
```jsx
const { books, toys } = store.getCurrent('books', 'toys');
```

---

#### `store.useCurrent(...keys: string[])`
>  A hook to retrieve the current values of specified properties. If no keys are provided, it returns values for all properties.

Examples:
```jsx
const { books, toys } = store.useCurrent();
```
```jsx
const { books } = store.useCurrent('books');
```

---

#### `store.useSelector(selector: function)`
>  A hook to retrieve the values by using selector.

Examples:
```jsx
const totalItems = store.useSelector(state => state.book + state.toys);
```
```jsx
const currentState = store.useSelector();
const totalItems = currentState.books = currentState.toys;
```

---

#### `store.useResetOnUnmount()`
> Hook to reset values on unmount.

Example:
```jsx
store.useResetOnUnmount();
```

---

#### `store.reset()`
> Resets current values to their initial values.

Example:
```jsx
store.reset();
```

---

#### `store.yourValue`
> Accesses the current value of a specific store property.

Example:
```jsx
const currentBooks = store.books;
```

---

#### `store.yourValue = value`
> Sets the current value of a specific store property.

Example:
```jsx
store.books = 5;
```

---

#### `store.yourValue.useCurrent(selector?: function)`
> Hook to get the current value of a specific store property.

Examples:
```jsx
const currentBooks = store.books.useCurrent();
```
```jsx
const currentBooksExist = store.books.useCurrent(v => v > 0);
```

---

#### `store.yourValue.setCurrent(functionOrValue)`
> Sets the current value of a specific store property. Accepts either a direct value to set or an updater function to modify the current value.

Examples:
```jsx
store.books.setCurrent(books => books + 1);
```
```jsx
store.books.setCurrent(2);
```

---

#### `store.yourValue.reset()`
> Resets the current value of a specific store property to its initial value.

Example:
```jsx
store.books.reset();
```
