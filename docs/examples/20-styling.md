---
sidebar_position: 20
---

import externalStylesheet from '@site/sandboxes/external-stylesheet.csb/_load';
import { Sandbox } from '@site/Sandbox';

# Styling inside Canvas Panel

There are 3 types of object you can type in 

* Canvases
* Annotation pages
* Annotations

As there is no representation of an Annotation Page in the viewer, this style is used as a cascade for styling 
annotations. Any styles applied to annotation pages will be applied to annotations inside. This allows you to style
full sets of annotations at once.

Canvases only support opacity. Annotations support box styles, but may also have custom CSS applied to them.

Styles can be applied either by using a **vault helper** or by using a property from the web component. If you use the
Vault helper you can apply styles prior to rendering your canvas panel. If you use the Vault Helper you should ensure 
that you pass in a scope of `atlas` as the 3rd argument.

## Box styles
There are currently a subset of styles that can be applied to annotations that will be rendered using the HTML canvas
if that is available. This will improve performance if you have large numbers of annotations being displayed - such
as OCR annotations.

```ts
cp.applyStyles(annotationPage, {
  backgroundColor: 'rgba(255, 0, 0, 0.5)',
  border: '3px solid blue',
  outline: '3px solid #000',
  opacity: 0.5,
});
```

Full list of properties:

```typescript
interface BoxStyles {
  backgroundColor: string; // colour or gradient function
  opacity: number;
  borderColor: string;
  borderWidth: string;
  borderStyle: string; // 'solid' only
  outlineColor: string;
  outlineWidth: string;
  outlineOffset: string;
  outlineStyle: string; // 'solid' only

  // Parsed.
  boxShadow: string;
  border: string; // 'solid' only
  outline: string; // 'solid' only
  background: string; // Alias for `backgroundColor:`
}
```

### States
You can set hover and active states, that support all the above properties. This can be used to create some basic 
interactivity for your annotations. These should be enough for most cases and avoid de-optimising and using CSS classes
directly.

```ts
cp.applyStyles(annotationPage, {
  backgroundColor: 'rgba(255, 0, 0, 0.5)',
  ':hover': {
    backgroundColor: 'rgba(255, 0, 0, 1)',
  },
  ':active': {
    backgroundColor: 'blue',
  },
});
```

### Vault helper
If you decide to use [Vault helpers](https://github.com/IIIF-Commons/vault-helpers) you will need to ensure you pass
in the correct scope when you apply styles.

```ts
import { createStyleHelper } from '@iiif/vault-helpers';
import { globalVault } from '@iiif/vault';

const helper = createStyleHelper(globalVault());

// For box styles.
helper.applyStyle(annotation, {
  background: 'red'
}, 'atlas');

// For setting a class name
helper.applyStyle(annotation, {
  className: 'my-custom-style',
}, 'html');
```


### Quirks
Some quirks of the box style.

* You can only use solid borders and outlines
* Box-sizing is fixed to content-box (so annotations may be shifted by borders)
* Some styles may not match exactly


## CSS Styles

If you would like to add more styles than these options you can set a custom class name instead.
```ts
cp.setClassName(annotationPage, 'my-custom-class');
```

Canvas panel exists in a web-component, so styles will not work out of the box. You have 3 options for applying
styles.

**1. Using `::part()`, which must be used instead of `.my-custom-class`**
```html
<style>
  canvas-panel::part(my-custom-class) {
    background: red;
  }
</style>
```

**2. Using `style-id`, where you can use normal CSS classses.**
```html
<style id="my-style">
  .my-custom-class {
    background: red;
  }
</style>
<canvas-panel style-id="my-style"></canvas-panel>
```

**3. Using an external stylesheet (where you can use normal CSS classes)**
```html
<canvas-panel stylesheet="https://example.org/styles.css"></canvas-panel>
```

<Sandbox project={externalStylesheet} />

### EXTRA

TODO

Although other pages show how things get styled in passing, this page summarises the approach and brings some examples together in one place.

This page also gives advice on how to make CP work with your layouts - how to make it flex, fill available space, and so on.


```javascript
cp.applyStyles(
  'https://iiif.io/api/image/3.0/example/reference/421e65be2ce95439b3ad6ef1f2ab87a9-dee-xray/full/max/0/default.jpg', {
    opacity: 0.5,
});
```


Does this one work?

```html
<canvas-panel 
  iiif-content="http://example.org/canvas-1.json" 
  choice-id="http://example.org/choice-set-a/3, http://example.org/choice-set-b/7#opacity=0.5" 
/>                                                       Useful for static rendering -----^
```
