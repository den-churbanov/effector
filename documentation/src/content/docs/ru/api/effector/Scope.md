---
title: Scope API
description: Scope API, его методы и особенности
---

# Scope API (#scope)

```ts
import { type Scope, fork } from "effector";

const scope = fork();
```

`Scope` — это полностью изолированный экземпляр приложения.
Основное назначение скоупа связано с SSR (Server-Side Rendering), но не ограничивается только этим случаем использования.
Скоуп содержит независимую копию всех юнитов (включая связи между ними), а также базовые методы для работы с ними.

:::tip{title="скоуп важен"}
Если вы хотите глубже разобраться в скоупах, ознакомьтесь с отличной статьёй про [изолированыне контексты](/ru/advanced/work-with-scope).<br/>
У нас также есть несколько гайдов связанных со скоупом:

- [Как исправить потерянный скоуп](/ru/guides/scope-loss)
- [Использование скоупов с SSR](/ru/guides/server-side-rendering)
- [Написание тестов](/ru/guides/testing)

:::

## Особенности скоупов (#scope-peculiarities)

1. [Существует несколько правил, которые нужно соблюдать, чтобы успешно работать со скоупом](/ru/advanced/work-with-scope#scope-rules).
2. [Скоуп можно потерять — чтобы этого избежать, используйте `scopeBind`](/ru/guides/scope-loss).

## Методы скоупа (#methods)

### `.getState($store)` (#methods-getState)

Возвращает значение стора в данном скоупе:

- **Формула**

```ts
const scope: Scope;
const $value: Store<T> | StoreWritable<T>;

const value: T = scope.getState($value);
```

- **Тип**

```ts
scope.getState<T>(store: Store<T>): T;
```

- **Возвращает**

Значение стора.

- **Пример**

Создадим два экземпляра приложения, вызовем события в каждом из них и проверим значение стора `$counter` в обоих случаях:

```js
import { createStore, createEvent, fork, allSettled } from "effector";

const inc = createEvent();
const dec = createEvent();
const $counter = createStore(0);

$counter.on(inc, (value) => value + 1);
$counter.on(dec, (value) => value - 1);

const scopeA = fork();
const scopeB = fork();

await allSettled(inc, { scope: scopeA });
await allSettled(dec, { scope: scopeB });

console.log($counter.getState()); // => 0
console.log(scopeA.getState($counter)); // => 1
console.log(scopeB.getState($counter)); // => -1
```

[Попробовать](https://share.effector.dev/0grlV3bA).

## Связанные API и статьи (#related-api-and-docs-to-create-effect)

- **API**

  - [`scopeBind`](/ru/api/effector/scopeBind) – Метод для привязки юнита к скоупу
  - [`fork`](/ru/api/effector/fork) – Оператор для создания скоупа
  - [`allSettled`](/ru/api/effector/allSettled) – Метод для вызова юнита в указанном скоупе и ожидания завершения всей цепочки эффектов
  - [`serialize`](/ru/api/effector/serialize) – Метод для получения сериализованных значений сторов
  - [`hydrate`](/ru/api/effector/hydrate) – Метод для гидрации сериализованных данных

- **Статьи**

  - [Что такое потеря скоупа и как её исправить](/ru/guides/scope-loss)
  - [Использование скоупов с SSR](/ru/guides/server-side-rendering)
  - [Как тестировать юниты](/ru/guides/testing)
