<template>
  <v-container>
    <v-card class="pa-8" color="black">
      <v-card class="pa-10 pb-2" elevation="6">
        <v-row>
          <v-col>
            <h1>Create a new Post</h1>
            <p class="mt-10">Post title</p>
            <v-text-field v-model="title" outlined label="Title"></v-text-field>
            <p class="">Post Text</p>
            <v-textarea v-model="text" outlined label="Text (optional)"></v-textarea>
            <v-btn @click="createThread()" :loading="load" color="primary">Submit</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span>{{ commmentCount }} Threads</span>
          </v-col>
        </v-row>
      </v-card>
      <hr class="my-5" />
      <v-row>
        <v-col>
          <h1>Main Threads</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card v-for="post in posts" :key="post.idx" class="my-2" :to="{ name: 'comments', params: post, query: { comments: post.commentsAddress, parent: post.parent } }">
            <v-card-title>
              {{ post.title }}
            </v-card-title>
            <v-card-text>
              {{ post.text }}
            </v-card-text>
            <div class="d-flex">
              <v-btn small class="transparent"> {{ post.commments }} comments </v-btn>
              <v-btn small class="transparent">
                {{ post.timestamp  }}
              </v-btn>
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
  name: "Community",

  data: () => ({
    seed: "SSTHISTHEREALLIFEISTHISJUSTFANTASYCAUGHTINALANDSLIDENOESCAPEFROMREALITYOPENYOUR9S",
    address: "BLDKD9OAVYMZGZMHFFBB9HCMBPXMNDEIOIFZNEOWISZAVILGRCMTVJVCJRWJCBHGZYIYKDU9SGZFDMZMZ",
    iota: null,
    title: "",
    text: "",
    posts: [],
    commmentCount: 0,
    load: false
  }),
  methods: {
    async countComments(val) {
      let response = await this.iota.findTransactionObjects({ addresses: [val] });
      return response.length;
    },
    async createThread() {
      this.load = true;
      setTimeout(async () => {
        let commentsAddress = await this.iota.getNewAddress(this.seed, { index: Math.random() * 1000000000000000000, total: 1 });
        let jsonPacket = { title: this.title, text: this.text, commentsAddress: commentsAddress[0] };
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
        let bundle = await this.iota.sendTrytes(trytes, 3, 10);
        this.loadThreads();
        this.title = "";
        this.text = "";
      }, 0);
    },
    async loadThreads() {
      let response = await this.iota.findTransactionObjects({ addresses: [this.address] });
      this.posts = [];

      for (let x of response) {
        try {
          let toConvert = x.signatureMessageFragment.slice(0, -1);
          toConvert = Converter.trytesToAscii(toConvert);
          toConvert = toConvert.replace(/\u0000/g, "");
          toConvert = JSON.parse(toConvert);
          toConvert.commments = 0;
          toConvert.timestamp = x.timestamp;
          toConvert.parent = x.hash;

          this.posts.push(toConvert);
        } catch (e) {
          let toConvert = x.signatureMessageFragment.slice(0, -1);
          toConvert = Converter.trytesToAscii(toConvert);
        }
      }
      this.commmentCount = this.posts.length;
      this.posts.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
      this.load = false;

      for (let x of this.posts) {
        let test = await this.countComments(x.commentsAddress);
        x.commments = test;
      }
    }
  },
  filters: {
    timeAgo(val) {
      return timeago.format(val * 1000);
    }
  },
  async mounted() {
    this.iota = iotaLibrary.composeAPI({
      provider: "https://nodes.comnet.thetangle.org:443"
    });
    this.loadThreads();
  }
};
</script>

<style lang="less"></style>
