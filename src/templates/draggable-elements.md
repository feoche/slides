---
foo: bar
dragPos:
  square: -87,0,0,0
square: 691,32,167,_,-16
---

## Draggable Elements

Double-click on the draggable elements to edit their positions.

<br>

###### Directive Usage

```vue
<img v-drag="'square'"
               src="https://sli.dev/logo.png">
```

<br>

###### Component Usage

```vue
<v-drag text-3xl>
  <div class="i-carbon:arrow-up"
           />
  Use the `v-drag` component to have a draggable container!
</v-drag>
```

<v-drag pos="612,188,261,_,-15">
  <div text-center text-3xl border border-main rounded>
    Double-click me!
  </div>
</v-drag>

<img v-drag="'square'"
src="https://sli.dev/logo.png">

###### Draggable Arrow

```md
<v-drag-arrow two-way />
```
<v-drag-arrow pos="170,473,-61,-183"
two-way op70 />
