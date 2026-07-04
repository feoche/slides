## Code

Here's an example of a code slide with syntax highlighting:

<!-- Code snippet -->
<<< @/src/theme/layoutHelper.ts [src/theme/layoutHelper.ts] {lineNumbers:true,maxHeight:'100%'} ts

```ts {monaco}
const result = helloWorld();
```

```ts {monaco-run}
console.log(new Date().toUTCString());
```

```ts {monaco-diff}
const result = helloWorld("true");
~~~
const result = helloWorld("false");
```

<!-- Speaker Notes -->