# Bike Advisor

This project contains a small bike recommendation tool built as a single page application.
It can be embedded into other pages using an `iframe`.

## Embedding with automatic height

Include the advisor page in an iframe and listen for height messages so the
surrounding content is pushed down when the advisor changes height.

```html
<iframe
  id="bike-advisor-iframe"
  src="PATH/TO/index.html"
  style="width:100%; border:0;"
  scrolling="no">
</iframe>

<script>
  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'setHeight') {
      var frame = document.getElementById('bike-advisor-iframe');
      if (frame) frame.style.height = event.data.height + 'px';
    }
  });
</script>
```

The embedded `index.html` posts its height to the parent using
`postMessage` whenever its content size changes. The script above resizes
the iframe accordingly so the page layout adjusts automatically.

## Locking the iframe when the modal opens

When the newsletter modal opens, `index.html` now sends additional
`postMessage` events so the embedding page can temporarily lock the
iframe in place:

```
{ type: 'modalOpen' }  // sent when the modal is shown
{ type: 'modalClose' } // sent when the modal is hidden
```

If your page listens for these messages you can switch the iframe to a
fixed position while the modal is visible and restore the normal layout
when it closes.

## Serving the files

If you copy the HTML into a CMS page instead of using the provided `index.html` file, make sure `style.css` and `script.js` are reachable via absolute URLs. A common symptom of missing files is a browser error like `Unexpected token '<'` because the server returns an HTML page instead of the expected script. Update the `<link>` and `<script>` tags to point to the correct locations and verify that both resources load without 404 errors.
