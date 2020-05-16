<template>
  <v-app>
    <v-app-bar dense app color="primary">
      <v-toolbar-items class="">
        <v-btn to="/" color="transparent" class="no-shadow"> <span class="mr-1">Hex</span><span class="font-weight-light">ac</span> </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items class="">
        <v-btn to="profile" color="transparent" class="no-shadow">profile </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>


export default {
  name: "App",

  components: {
    
  },

  data: () => ({
    //
  }),
  computed: {
    seed() {
      return this.$store.state.seed;
    },
    account() {
      return this.$store.state.account;
    },
  },
  methods: {
    generateSeed(length) {
      const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9";
      let buffer = "";
      for (let i = 0; i < length; i++) {
        buffer += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return buffer;
    },
  },
  mounted() {
    if (this.seed == "") {
      this.$store.commit("updateSeed", this.generateSeed(81));
    }
    if (this.account == "") {
      this.$store.commit("updateAccount", this.generateSeed(5));
    }
  },
};
</script>
