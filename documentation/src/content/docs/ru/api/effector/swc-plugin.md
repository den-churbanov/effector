---
title: SWC плагин
lang: ru
---

Официальный SWC плагин может быть использован для SSR и более удобного опыта отладки в проектах, использующих SWC, таких как [Next.js](https://nextjs.org) или Vite с плагином [vite-react-swc](https://github.com/vitejs/vite-plugin-react-swc).

Плагин обладает той же функциональностью, что и встроенный [`babel-plugin`](/en/api/effector/babel-plugin).  
Он предоставляет всем [Юнитам](/en/explanation/glossary#unit) уникальные `сиды` ([Стабильные Идентификаторы](/en/explanation/sids)) и имена, а также другую отладочную информацию.

:::warning{title="Нестабильно"}
Этот SWC плагин, как и все другие SWC плагины, в настоящее время считается экспериментальным и нестабильным.

SWC и Next.js могут не следовать semver, когда речь идет о совместимости плагинов.
:::

# Установка (#installation)

Установите @effector/swc-plugin с помощью предпочитаемого менеджера пакетов.

```bash
npm install -ED @effector/swc-plugin
```

## Версионирование (#installation-versioning)

Чтобы избежать проблем с совместимостью, вызванных критическими изменениями в SWC или Next.js, этот плагин публикует разные ['метки'](https://semver.org/#spec-item-9) для разных версий `@swc/core`. Обратитесь к таблице ниже, чтобы выбрать правильную версию плагина для вашей настройки.

:::tip{title="Примечание"}
Для большей стабильности мы рекомендуем зафиксировать версии как вашей среды выполнения (например, Next.js или `@swc/core`), так и версию `@effector/swc-plugin`.

Используйте опцию `--exact`/`--save-exact` в вашем менеджере пакетов, чтобы установить конкретные, совместимые версии. Это гарантирует, что обновления одной зависимости не сломают ваше приложение.
:::

| Версия `@swc/core` | Версия Next.js                           | Правильная версия плагина |
| ------------------ | ---------------------------------------- | ------------------------- |
| `>=1.4.0 <1.6.0`   | `>=14.2.0 <=14.2.15`                     | `@swc1.4.0`               |
| `>=1.6.0 <1.7.0`   | `>=15.0.0-canary.37 <=15.0.0-canary.116` | `@swc1.6.0`               |
| `>=1.7.0 <1.8.0`   | `>=15.0.0-canary.122 <=15.0.2`           | `@swc1.7.0`               |
| `>=1.9.0 <1.10.0`  | `>=15.0.3 <=15.1.6`                      | `@swc1.9.0`               |
| `>=1.10.0 <1.11.0` | `>=15.2.0 <15.2.1`                       | `@swc1.10.0`              |
| `>=1.11.0`         | `>=15.2.1`                               | `@swc1.11.0`              |

Для получения дополнительной информации о совместимости обратитесь к документации SWC по [Выбору версии SWC](https://swc.rs/docs/plugin/selecting-swc-core) и интерактивной [таблице совместимости](https://plugins.swc.rs) на сайте SWC.

# Использование (#usage)

Чтобы использовать плагин, просто добавьте его в конфигурацию вашего инструмента.

## Next.js (#usage-nextjs)

Если вы используете [Next.js Compiler](https://nextjs.org/docs/architecture/nextjs-compiler), работающий на SWC, добавьте этот плагин в ваш `next.config.js`.

```js
const nextConfig = {
  experimental: {
    // даже если пусто, передайте объект опций `{}` в плагин
    swcPlugins: [["@effector/swc-plugin", {}]],
  },
};
```

Вам также нужно установить официальные [`@effector/next`](https://github.com/effector/next) привязки, чтобы включить SSR/SSG.

:::warning{title="Turbopack"}
Обратите внимание, что некоторые функции могут не работать при использовании Turbopack с NextJS, особенно с [относительными `factories`](#configuration-factories). Используйте на свой страх и риск.
:::

## .swcrc (#usage-swcrc)

Добавьте новую запись в опцию `jsc.experimental.plugins` в вашем `.swcrc`.

```json
{
  "$schema": "https://json.schemastore.org/swcrc",
  "jsc": {
    "experimental": {
      "plugins": [["@effector/swc-plugin", {}]]
    }
  }
}
```

# Конфигурация (#configuration)

## `factories` (#configuration-factories)

Укажите массив имен модулей или файлов, которые следует рассматривать как [пользовательские фабрики](/en/explanation/sids/#custom-factories). При использовании SSR фабрики необходимы для обеспечения уникальных [`SID`](/en/explanation/sids) по всему вашему приложению.

:::tip{title="Примечание"}
Пакеты (`patronum`, `@farfetched/core`, `atomic-router` и [`@withease/factories`](https://github.com/withease/factories)) всегда включены в список фабрик, поэтому вам не нужно явно их перечислять.
:::

### Формула (#configuration-factories-formulae)

```json
["@effector/swc-plugin", { "factories": ["./path/to/factory", "factory-package"] }]
```

- Тип: `string[]`
- По умолчанию: `[]`

Если вы предоставляете относительный путь (начинающийся с `./`), плагин рассматривает его как локальную фабрику относительно корневой директории вашего проекта. Эти фабрики могут быть импортированы только с использованием относительных импортов в вашем коде.

В противном случае, если вы указываете имя пакета или алиас TypeScript, это интерпретируется как точный спецификатор импорта. Вы должны использовать такой импорт точно так, как указано в конфигурации.

### Примеры (#configuration-factories-examples)

```json
// конфигурация
["@effector/swc-plugin", { "factories": ["./src/factory"] }]
```

```ts
// файл: /src/factory.ts
import { createStore } from "effector";

/* createBooleanStore — это фабрика */
export const createBooleanStore = () => createStore(true);
```

```ts
// файл: /src/widget/user.ts
import { createBooleanStore } from "../factory";

const $boolean = createBooleanStore(); /* Рассматривается как фабрика! */
```

## `debugSids` (#configuration-debugSids)

Добавляет полный путь к файлу и имя Юнита к сгенерированным сидам для более удобной отладки проблем с SSR.

### Формула (#configuration-debugSids-formulae)

```json
["@effector/swc-plugin", { "debugSids": false }]
```

- Тип: `boolean`
- По умолчанию: `false`

## `hmr` (#configuration-hmr)

:::info{title="Начиная с"}
`@effector/swc-plugin@0.7.0`
:::

Включите поддержку Hot Module Replacement (HMR) для очистки связей, подписок и побочных эффектов, управляемых Effector. Это предотвращает двойное срабатывание эффектов и наблюдателей.

:::warning{title="Экспериментально"}
Хотя опция и протестирована, она считается экспериментальной и может иметь неожиданные проблемы в разных сборщиках.
:::

### Формула (#configuration-hmr-formulae)

```json
["@effector/swc-plugin", { "hmr": "es" }]
```

- Тип: `"es"` | `"cjs"` | `"none"`
  - `"es"`: Использует API HMR `import.meta.hot` в сборщиках, соответствующих ESM, таких как Vite и Rollup
  - `"cjs"`: Использует API HMR `module.hot` в сборщиках, использующих CommonJS модули, таких как Webpack и Next.js
  - `"none"`: Отключает Hot Module Replacement.
- По умолчанию: `none`

:::info{title="Обратите внимание"}
При сборке для продакшена убедитесь, что установили опцию `hmr` в `"none"`, чтобы уменьшить размер бандла и улучшить производительность в runtime.
:::

## `addNames` (#configuration-addNames)

Добавляет имена к [Юнитам](/en/explanation/glossary#unit) при вызове фабрик (таких как `createStore` или `createDomain`). Это полезно для отладки во время разработки и тестирования, но рекомендуется отключать это для минификации.

### Формула (#configuration-addNames-formulae)

```json
["@effector/swc-plugin", { "addNames": true }]
```

- Тип: `boolean`
- По умолчанию: `true`

## `addLoc` (#configuration-addLoc)

Включает информацию о местоположении (пути к файлам и номера строк) для [Юнитов](/en/explanation/glossary#unit) и фабрик. Это полезно для отладки с такими инструментами, как [`effector-logger`](https://github.com/effector/logger).

### Формула (#configuration-addLoc-formulae)

```json
["@effector/swc-plugin", { "addLoc": false }]
```

- Тип: `boolean`
- По умолчанию: `false`

## `forceScope` (#configuration-forceScope)

Внедряет `forceScope: true` во все [хуки](/en/api/effector-react/#hooks) или вызовы `@effector/reflect`, чтобы гарантировать, что ваше приложение всегда использует `Scope` во время рендеринга. Если `Scope` отсутствует, будет выброшена ошибка, что устраняет необходимость в импортах `/scope` или `/ssr`.

:::info{title="Примечание"}
Подробнее о [принудительном использовании Scope](/en/api/effector-react/module/scope/#scope-enforcement) в документации `effector-react`.
:::

### Формула (#configuration-forceScope-formulae)

```json
["@effector/swc-plugin", { "forceScope": false }]
```

- Тип: `boolean | { hooks: boolean, reflect: boolean }`
- По умолчанию: `false`

#### `hooks` (#configuration-forceScope-formulae-hooks)

Принудительно заставляет все хуки из [`effector-react`](/en/api/effector-react#hooks) и [`effector-solid`](/en/api/effector-solid#reactive-helpers), такие как `useUnit` и `useList`, использовать `Scope` в runtime.

#### `reflect` (#configuration-forceScope-formulae-reflect)

:::info{title="с"}
Поддерживается `@effector/reflect` начиная с 9.0.0
:::

Для пользователей [`@effector/reflect`](https://github.com/effector/reflect) принудительно заставляет все компоненты, созданные с помощью библиотеки `reflect`, использовать `Scope` в runtime.

## `transformLegacyDomainMethods` (#configuration-transformLegacyDomainMethods)

Если включено (по умолчанию), эта опция преобразует [создатели Юнитов в Доменах](/en/api/effector/Domain#unit-creators), такие как `domain.event()` или `domain.createEffect()`. Однако это преобразование может быть ненадежным и может повлиять на несвязанный код. Если это ваш случай, отключение этой опции может исправить эти проблемы.

Отключение этой опции **остановит** добавление [`SID`](/en/explanation/sids) и другой отладочной информации к этим создателям юнитов. Убедитесь, что ваш код не зависит от методов домена перед отключением.

:::tip
Вместо использования создателей юнитов напрямую на домене, рассмотрите использование аргумента `domain` в обычных методах.
:::

### Формула (#configuration-transformLegacyDomainMethods-formulae)

```json
["@effector/swc-plugin", { "transformLegacyDomainMethods": true }]
```

- Тип: `boolean`
- По умолчанию: `true`
