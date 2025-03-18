---
title: useStore
description: Реакт-хук для подписки компонента на стор
lang: ru
---

:::warning{title="Устаревшее API "}

Рекомендуется использовать хук [`useUnit`](/ru/api/effector-react/useUnit).
:::

Реакт-хук, который подписывается на [стор](/ru/api/effector/Store) и возвращает его текущее значение, поэтому при обновлении стора, компонент также будет автоматически обновлён

```ts
useStore(store: Store<T>): T
```

**Аргументы**

1. `store`: [Store](/ru/api/effector/Store)

**Возвращает**

(_`State`_): Значение из стора

### Пример

```jsx
import { createStore, createApi } from "effector";
import { useStore } from "effector-react";

const $counter = createStore(0);

const { increment, decrement } = createApi($counter, {
  increment: (state) => state + 1,
  decrement: (state) => state - 1,
});

const App = () => {
  const counter = useStore($counter);
  return (
    <div>
      {counter}
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};
```

[Запустить пример](https://share.effector.dev/DHzp3z4r)
