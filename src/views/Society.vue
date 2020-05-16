<template>
  <section>
    <ThreadFrame>
      <div slot="head">
        <div>Society</div>
      </div>
      <Society slot="main" />
    </ThreadFrame>
  </section>
</template>

<script>
import ThreadFrame from "../components/thread/Thread_Slot.vue";
import Society from "../components/thread/Society.vue";

export default {
  components: {
    ThreadFrame,
    Society,
  },
};
</script>
