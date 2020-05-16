<template>
  <section>
    <v-toolbar color="grey darken-4">
      <v-toolbar-title class="ml-5">
        <slot name="head"></slot>
      </v-toolbar-title>
    </v-toolbar>

    <v-tabs v-model="active_tab" color="primary" class="fill-height" background-color="grey darken-4" vertical>
      <v-tab>
        <v-icon left>mdi-home</v-icon>
        Main
      </v-tab>

      <v-tab-item>
        <v-container class="">
          <v-row>
            <v-col class="">
              <slot name="main"></slot>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </section>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      active_tab: 0,
    };
  },
};
</script>

<style lang="less">
.v-tab {
  width: 168.36px;
}

section {
  height: 100%;
  overflow-y: hidden;
}

section {
  height: 100%;
  overflow-y: hidden;
}
</style>
