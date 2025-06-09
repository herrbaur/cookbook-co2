<script lang="ts">
  import 'bootstrap/dist/css/bootstrap.min.css';
  import '../app.css';

  // Nur im Browser: JS-Funktionalität wie Modals, Dropdowns, etc.
  if (typeof window !== 'undefined') {
  // @ts-ignore
  import('bootstrap/dist/js/bootstrap.bundle.min.js');
}
</script>

<slot />
