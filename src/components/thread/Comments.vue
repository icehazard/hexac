<template>
  <v-container>
    <v-card class="pa-8" color="grey darken-4">
      <v-card class="pa-10 pb-0" elevation="6">
        <v-row>
          <v-col>
            <h1>{{ parentTitle }}</h1>
            <p class="mt-10">{{ parentText }}</p>
            <p class="">{{ this.$route.params.timestamp }}</p>
            <v-textarea v-model="text" outlined label="Text (optional)"></v-textarea>
            <v-btn @click="createThread(address)" color="primary">Submit</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <p class="mt-3">{{ commmentCount }} Comments</p>
        </v-row>
      </v-card>
      <hr class="my-5" />
      <v-row>
        <v-col>
          <h1>Comments</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card v-for="post in allposts" :key="post.idx" class="my-1" :to="{ name: 'comments', params: post }">
            <div class="d-flex ">
              <v-divider v-for="index in post.depth" :key="index" vertical class="ml-7"></v-divider>
              <div class="">
              <div class="d-flex overline ma-3">
                {{post.account}}
                         <timeago class="overline grey--text ml-5" :auto-update="60" :datetime="new Date(post.timestamp * 1000)"></timeago>
              </div>
             
                <div class="d-flex align-center">
                  <v-avatar :color="colours[Math.floor(Math.random() * colours.length)]" size="30" class="ml-3">
                    <span class="white--text overline nudgeRight">{{ post.account | shortenName }}</span>
                  </v-avatar>
                  <v-card-text class="ml-3 body-2 font-weight-light pa-1">
                    {{ post.text }}
                  </v-card-text>
                </div>
                <div class="d-flex">
                  <v-divider vertical class="ml-7"></v-divider>
                  <v-btn small class="transparent grey--text">
                    <v-icon> mdi-arrow-up-bold</v-icon>
                  </v-btn>
                  <div class="overline d-flex align-center">{{ Math.floor(Math.random() * 1000) }}</div>
                  <v-btn small class="transparent grey--text">
                    <v-icon> mdi-arrow-down-bold</v-icon>
                  </v-btn>
                  <div class="overline d-flex align-center grey--text">({{ Math.floor(Math.random() * 1000) }}/{{ Math.floor(Math.random() * 1000) }})</div>
                  <v-btn small class="transparent grey--text">
                    <v-icon left>mdi-message</v-icon>
                    <div class="overline">{{ post.commments }} Reply</div>
                  </v-btn>
                  <!-- <v-btn small class="transparent ">
                    <timeago class="overline grey--text" :auto-update="60" :datetime="new Date(post.timestamp * 1000)"></timeago>
                  </v-btn> -->
                  <!-- <v-btn small class="transparent grey--text">
                    <v-icon left>mdi-account</v-icon>
                    <div class="overline">By {{ post.account }}</div>
                  </v-btn> -->
                  <v-btn small class="transparent grey--text">
                    <v-icon left>mdi-share</v-icon>
                    <div class="overline">Share</div>
                  </v-btn>
                  <v-btn small class="transparent grey--text">
                    <v-icon left>mdi-star</v-icon>
                    <div class="overline">Save</div>
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
const iotaLibrary = require("@iota/core");
const Converter = require("@iota/converter");

export default {
  name: "Comments",

  data: () => ({
    seed: "SSTHISTHEREALLIFEISTHISJUSTFANTASYCAUGHTINALANDSLIDENOESCAPEFROMREALITYOPENYOUR9S",
    address: "",
    parent: "",
    iota: null,
    title: "",
    text: "",
    posts: [],
    allposts: [],
    commmentCount: 0,
    parentTitle: "",
    parentText: "",
    colours: ["blue", "green", "brown", "primary", "amber", "purple"],
  }),
  methods: {
    async createThread(address) {
      let commentsAddress = await this.iota.getNewAddress(this.seed, { index: Math.random() * 1000000000000000000, total: 1 });
      let jsonPacket = { text: this.text, commentsAddress: commentsAddress[0], account: this.account };
      let stringMessage = JSON.stringify(jsonPacket);
      let message = Converter.asciiToTrytes(stringMessage);
      let transfers = [
        {
          value: 0,
          address: address,
          message: message,
        },
      ];

      let trytes = await this.iota.prepareTransfers(this.seed, transfers);
      let bundle = await this.iota.sendTrytes(trytes, 3, 10);
      this.posts = await this.loadThreads(address);
      this.title = "";
      this.text = "";
    },
    async loadThreads(level, address) {
      let response = await this.iota.findTransactionObjects({ addresses: [address] });

      let tempPosts = [];

      for (let x of response) {
        try {
          let toConvert = x.signatureMessageFragment.slice(0, -1);
          toConvert = Converter.trytesToAscii(toConvert);
          toConvert = toConvert.replace(/\u0000/g, "");
          toConvert = JSON.parse(toConvert);
          toConvert.timestamp = x.timestamp;
          toConvert.depth = level;
          tempPosts.push(toConvert);
          this.allposts.push(toConvert);
          await this.loadThreads(level + 1, toConvert.commentsAddress);
        } catch (e) {}
      }
      this.commmentCount = tempPosts.length;
      return tempPosts.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
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
    },
  },
  filters: {
    shortenName(val) {
      return val.slice(0, 3);
    },
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
  async mounted() {
    this.iota = iotaLibrary.composeAPI({
      provider: "https://nodes.comnet.thetangle.org:443",
    });

    this.address = this.$route.query.comments;
    this.parent = this.$route.query.parent;

    if (this.$route.params) {
      this.parentTitle = this.$route.params.title;
      this.parentText = this.$route.params.text;
    }

    this.posts = await this.loadThreads(0, this.address);
    this.loadHeader();
  },
};
</script>

<style lang="less">
.nudgeRight {
  margin-left: 3px;
}
</style>
