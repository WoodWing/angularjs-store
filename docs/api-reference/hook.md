# hook

Listen to certain dispatched action.

**@paramaters**

| Name | Type | Description |
| :--- | :--- | :--- |
| _**actionQuery**_ | `string`  `string[]` `RegExp` | Query that control the hook to only respond on certain dispatched actions. It can be a `string` for querying single action or it can be an array of `string` or `RegExp` to query multiple actions. |
| _**reducer\(s\)**_ | `function` `function[]` | Function\(s\) that called after the dispatched action are passed to `actionQuery` test. Function should be look like: `function (state, calls) {...}` |

**@return**

| Type | Description |
| :--- | :--- |
| `HookLink` | `HookLink` instance, can be used for removing the hook from store. |
