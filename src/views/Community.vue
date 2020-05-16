<template>
  <section>
    <ThreadFrame>
      <div slot="head">
        <div>Community</div>
      </div>
      <Community slot="main" />
    </ThreadFrame>
  </section>
</template>

<script>
import ThreadFrame from "../components/thread/Thread_Slot.vue";
import Community from "../components/thread/Community.vue";

export default {
  components: {
    ThreadFrame,
    Community,
  },
};
</script>
