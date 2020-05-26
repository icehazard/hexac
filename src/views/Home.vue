<template>
  <v-container>
    <v-card :class="{ 'pa-10': $vuetify.breakpoint.mdAndUp }" color="black">
      <v-card class="pa-10 pb-0" elevation="6">
      <v-row>
        <v-col>
          <h3>{{ parentTitle }}</h3>
          <p class="mt-10">{{ parentText }}</p>
          <p class="">{{ this.$route.params.timestamp | timeAgo }}</p>
          <v-textarea v-model="text" outlined label="Text (optional)"></v-textarea>
          <v-btn @click="createThread()" color="primary">Submit</v-btn>
        </v-col>
      </v-row>
      <v-row>
          <p class="mt-3">{{ commmentCount }} Comments</p>
      </v-row>
    </v-card>
    <hr class="my-5" />
    <v-row>
      <v-col>
        <h1 class="ml-5">Comments</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card v-for="post in posts" :key="post.idx" class="my-2">
          <v-card-text>
            {{ post.text }}
          </v-card-text>
          <v-card-text>
            {{ post.timestamp  }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    </v-card>
  </v-container>
</template>

<script>
const iotaLibrary = require("@iota/core");
const Converter = require("@iota/converter");
const Trytes = require("trytes");


export default {
  name: "Home",

  data: () => ({
    seed: "SSTHISTHEREALLIFEISTHISJUSTFANTASYCAUGHTINALANDSLIDENOESCAPEFROMREALITYOPENYOUR9S",
    address: "XDGVTEZ9HYSCVFHRLIMPTQKKHTLIVNUWI9WYZWQOJOFMMILHSVWXWX9EHBYYB9VSUXDDICMGUNGRFRHSY",
    parent: "",
    iota: null,
    title: "",
    text: "",
    posts: [],
    commmentCount: 0,
    parentTitle: "",
    parentText: ""
  }),
  methods: {
    async createThread() {
      let commentsAddress = await this.iota.getNewAddress(this.seed, { index: Math.random() * 1000000000000000000, total: 1 });
      console.log("createThread -> commentsAddress", commentsAddress)
      let jsonPacket = { text: this.text, commentsAddress: commentsAddress[0] };
      let stringMessage = JSON.stringify(jsonPacket);
      let message = Converter.asciiToTrytes(stringMessage);
      let transfers = [
        {
          value: 0,
          address: this.address,
          message: message
        }
      ];

      let trytes = await this.iota.prepareTransfers(this.seed, transfers);
      let bundle = await this.iota.sendTrytes(trytes, 3, 14);
      this.loadThreads();
      this.title = "";
      this.text = "";
    },
    async loadThreads() {
      let response = await this.iota.findTransactionObjects({ addresses: [this.address] });
      console.log("loadThreads -> response", response)

      this.posts = [];

      for (let x of response) {
        try {
          let toConvert = x.signatureMessageFragment.slice(0, -1);
          toConvert = Converter.trytesToAscii(toConvert);
          toConvert = toConvert.replace(/\u0000/g, "");
          toConvert = JSON.parse(toConvert);
          toConvert.timestamp = x.timestamp;
          this.posts.push(toConvert);
        } catch (e) {
          let toConvert = x.signatureMessageFragment.slice(0, -1);
          toConvert = Converter.trytesToAscii(toConvert);
        }
      }
      this.commmentCount = this.posts.length;
      this.posts.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
    },
    async loadHeader() {
      let response = await this.iota.getTransactionObjects([this.parent]);

      let x = response[0];
      let toConvert = x.signatureMessageFragment.slice(0, -1);
      toConvert = Converter.trytesToAscii(toConvert);
      toConvert = toConvert.replace(/\u0000/g, "");
      toConvert = JSON.parse(toConvert);
      this.parentTitle = toConvert.title;
      this.parentText = toConvert.text;
    }
  },
  filters: {
    timeAgo(val) {
      return// timeago.format(val * 1000);
    }
  },
  async mounted() {
    this.iota = iotaLibrary.composeAPI({
      provider: "https://nodes.thetangle.org:443"
    });




    this.loadThreads();
    //this.loadHeader();

  }
};
</script>

<style lang="less">
  img{
  width: 110px;;
}

.container {
  max-width: 1185px !important;
}
</style>
