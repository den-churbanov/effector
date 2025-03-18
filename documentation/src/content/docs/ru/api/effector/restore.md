---
title: restore
lang: ru
---

```ts
import { restore } from "effector";
```

# Методы (#methods)

## `restore(event, defaultState)` (#methods-restore-event-defaultState)

Создает [_StoreWritable_](/en/api/effector/Store) из [_Event_](/en/api/effector/Event). Работает как сокращение для `createStore(defaultState).on(event, (_, payload) => payload)`.

:::warning{title="Это не производный стор"}
`restore` создает новый стор. Это не [производный стор](/en/api/effector/Store#readonly). Это означает, что вы можете изменять его состояние через события и использовать его как `target` в [sample](/en/api/effector/sample).
:::

### Формула (#methods-restore-event-defaultState-formulae)

```ts
restore(event: Event<T>, defaultState: T): StoreWritable<T>
```

### Аргументы (#methods-restore-event-defaultState-arguments)

1. `event` [_Event_](/en/api/effector/Event)
2. `defaultState` (_Payload_)

### Возвращает (#methods-restore-event-defaultState-returns)

[_StoreWritable_](/en/api/effector/Store): Новый стор.

### Примеры (#methods-restore-event-defaultState-examples)

#### Базовый пример (#methods-restore-event-defaultState-examples-basic)

```js
import { createEvent, restore } from "effector";

const event = createEvent();
const $store = restore(event, "default");

$store.watch((state) => console.log("state: ", state));
// state: default

event("foo");
// state: foo
```

[Запустить пример](https://share.effector.dev/MGGQnTlQ)

## `restore(effect, defaultState)` (#methods-restore-effect-defaultState)

Создает [_StoreWritable_](/en/api/effector/Store) из успешных результатов [_Effect_](/en/api/effector/Effect). Работает как сокращение для `createStore(defaultState).on(effect.done, (_, {result}) => result)`.

### Формула (#methods-restore-effect-defaultState-formulae)

```ts
restore(effect: Effect<Params, Done, Fail>, defaultState: Done): StoreWritable<Done>
```

### Аргументы (#methods-restore-effect-defaultState-arguments)

1. `effect` [_Effect_](/en/api/effector/Effect)
2. `defaultState` (_Done_)

### Возвращает (#methods-restore-effect-defaultState-returns)

[_StoreWritable_](/en/api/effector/Store): Новый стор.

### Типы (#methods-restore-effect-defaultState-types)

Store будет иметь тот же тип, что и `Done` из `Effect<Params, Done, Fail>`. Также `defaultState` должен иметь тип `Done`.

### Примеры (#methods-restore-effect-defaultState-examples)

#### Эффект (#methods-restore-effect-defaultState-examples-effect)

```js
import { createEffect, restore } from "effector";

const fx = createEffect(() => "foo");
const $store = restore(fx, "default");

$store.watch((state) => console.log("state: ", state));
// => state: default

await fx();
// => state: foo
```

[Запустить пример](https://share.effector.dev/tP6RQsri)

## `restore(shape)` (#methods-restore-shape)

Создает объект с сторами из объекта с значениями.

### Формула (#methods-restore-shape-formulae)

TBD

### Аргументы (#methods-restore-shape-arguments)

1. `shape` (_State_)

### Возвращает (#methods-restore-shape-returns)

[_StoreWritable_](/en/api/effector/Store): Новый стор.

### Примеры (#methods-restore-shape-examples)

#### Объект (#methods-restore-shape-examples-object)

```js
import { restore } from "effector";

const { foo: $foo, bar: $bar } = restore({
  foo: "foo",
  bar: 0,
});

$foo.watch((foo) => {
  console.log("foo", foo);
});
// => foo 'foo'
$bar.watch((bar) => {
  console.log("bar", bar);
});
// => bar 0
```

[Запустить пример](https://share.effector.dev/NQX0kotI)
