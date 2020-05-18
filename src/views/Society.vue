<template>
  <section>
    <ThreadFrame>
      <div slot="head">
        <div>Society</div>
      </div>
      <Society slot="main" />
      <createCommunity slot="submit" />
    </ThreadFrame>
  </section>
</template>

<script>
import ThreadFrame from "../components/thread/Thread_Slot.vue";
import Society from "../components/thread/Society.vue";
import createCommunity from '../components/thread/CreateCommunity.vue'

export default {
  components: {
    ThreadFrame,
    Society,
    createCommunity
  },
};
</script>
