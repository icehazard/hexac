<template>
  <section>
    <v-toolbar color="grey darken-4">
      <v-toolbar-title class="ml-5">Community </v-toolbar-title>
    </v-toolbar>

    <v-tabs v-model="active_tab" color="primary" class="fill-height" background-color="grey darken-4" vertical>
      <v-tab>
        <v-icon left>mdi-home</v-icon>
        Main
      </v-tab>

      <!-- <v-tab>
        <v-icon left>mdi-view-list</v-icon>
        Dataset Lists
      </v-tab>

      <v-tab>
        <v-icon left>mdi-update</v-icon>
        Prediction
      </v-tab> -->

      <v-tab-item>
        <v-container class="">
          <v-row>
            <v-col class="d-flex justify-start">
               <slot></slot>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container class="">
          <v-row>
            <v-col>
              <!-- <Graph></Graph> -->
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <!-- <Lists></Lists> -->
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <v-container class="">
          <v-row>
            <v-col>
              <!-- <StategyBuilder></StategyBuilder> -->
            </v-col>
          </v-row>
          <v-row>
            <v-col> </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </section>
</template>

<script>
import Community from "./Community";

export default {
  components: {
    Community,
  },
  data(){
    return {
      active_tab: 0,
    }
  }
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
