<template>
  <section>
    <ThreadFrame>
      <div slot="head">
        <div>Comments</div>
      </div>
      <Comments slot="main" />
    </ThreadFrame>
  </section>
</template>

<script>
import ThreadFrame from "../components/thread/Thread_Slot.vue";
import Comments from "../components/thread/Comments.vue";

export default {
  components: {
    ThreadFrame,
    Comments,
  },
};
</script>
