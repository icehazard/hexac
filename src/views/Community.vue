<template>
  <section>
 <ThreadFrame>
  <Community />
 </ThreadFrame>
  </section>
</template>

<script>
import Community from "../components/thread/Community.vue";
import ThreadFrame from "../components/thread/Thread_Slot.vue";

export default {
   components: {
    ThreadFrame,
    Community
  },

}
</script>

<style>

</style>