<template>
  <v-container>
    <v-card class="pa-8" color="grey darken-4">
      <v-card class="pa-10 pb-0" elevation="6">
        <v-row>
          <v-col>
            <h1>{{ parentTitle }}</h1>
            <p class="mt-10">{{ parentText }}</p>
            <p class>{{ this.$route.params.timestamp }}</p>
            <v-textarea v-model="text" outlined label="Text (optional)"></v-textarea>
            <v-btn @click="postThread()" :loading="load" color="primary">Submit</v-btn>
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
          <div
            v-for="(post, index) in allposts"
            :key="index"
            class="my-0"
            :to="{ name: 'comments', params: post }"
          >
            <v-card>
              <div class="d-flex">
                <v-divider v-for="index in post.depth" :key="index" vertical class="ml-6"></v-divider>
                <div class>
                  <div class="d-flex overline ma-3 mb-1">
                   <div>
                      {{ post.account }}
                   </div>
                    <timeago
                      class="overline grey--text text--darken-1 ml-3"
                      :auto-update="60"
                      :datetime="new Date(post.timestamp * 1000)"
                    ></timeago>
                  </div>

                  <div class="d-flex align-center">
                    <v-avatar
                      :color="colours[post.account[0].toLowerCase()]"
                      size="25"
                      class="ml-3"
                    >
                      <span
                        class="white--text overline nudgeRight font-xs"
                      >{{ post.account | shortenName }}</span>
                    </v-avatar>
                    <v-card-text class="ml-3 body-2 font-weight-light pa-1">{{ post.text }}</v-card-text>
                  </div>
                  <div class="d-flex">
                    <v-divider vertical class="ml-6"></v-divider>
                    <v-btn small class="transparent grey--text text--darken-1">
                      <v-icon>mdi-arrow-up-bold</v-icon>
                    </v-btn>
                    <div class="overline d-flex align-center">{{ 1}}</div>
                    <v-btn small class="transparent grey--text text--darken-1">
                      <v-icon>mdi-arrow-down-bold</v-icon>
                    </v-btn>
                    <div class="overline d-flex align-center grey--text mr-2">({{1 }}/{{ 1 }})</div>
                    <v-btn
                      @click.prevent="replyFunc(post, index)"
                      small
                      class="transparent grey--text text--darken-1"
                    >
                      <v-icon small left>mdi-message</v-icon>
                      <div class="overline">{{ post.commments }} Reply</div>
                    </v-btn>

                    <v-btn small class="transparent grey--text text--darken-1">
                      <v-icon small left>mdi-share</v-icon>
                      <div class="overline">Share</div>
                    </v-btn>
                    <v-btn small class="transparent grey--text text--darken-1">
                      <v-icon small left>mdi-star</v-icon>
                      <div class="overline">Save</div>
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card>
            <v-card v-if="index == replyActive">
              <div class="d-flex">
                <v-divider vertical class="ml-6"></v-divider>
                <v-divider v-for="index in post.depth" :key="index" vertical class="ml-6"></v-divider>
                <v-card-text>
                  <v-container fluid>
                    <v-row>
                      <v-col>
                        <v-textarea v-model="replyText" outlined></v-textarea>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="d-flex justify-end my-n10">
                        <v-btn @click="postReply()" color="primary">Reply</v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
const iotaLibrary = require("@iota/core");
const Converter = require("@iota/converter");
const utf = require('tryte-utf8-json-codec');
const Trytes = require('trytes');

export default {
  name: "Comments",

  data: () => ({
    parent: "",
    title: "",
    text: "",
    posts: [],
    load: false,
    allposts: [],
    commmentCount: 0,
    parentTitle: "",
    parentText: "",
    replyText: "",
    reply: "",
    replyActive: -1,
    colours: {
      a: "pink",
      b: "purple",
      c: 'deep-purple',
      d: 'indigo',
      e: 'cyan',
      f: 'teal',
      g: 'green',
      h: 'light-green',
      i: "blue",
      j: 'lime',
      k: 'yellow darken-1',
      l: 'amber',
      m: 'orange',
      n: 'deep-orange',
      o: 'brown',
      p: 'blue-grey',
      q: 'grey',
      r: 'black',
      s: "red",
      t: 'white',
      u: 'grey darken-3',
      v: 'grey darken-2',
      w: 'grey darken-1',
      x: 'grey lighten-1',
      y: 'blue-grey darken-4',
      z: 'blue-grey darken-2',
      9: 'brown darken-4'

     
    }
  }),
  methods: {
    async createThread() {
      let commentsAddress = await this.iota.getNewAddress(this.seed, {
        index: Math.random() * 1000000000000000000
      });
      let jsonPacket = {
        text: this.text,
        commentsAddress: commentsAddress,
        account: this.account,
        referenceAddress: this.reply
      };
      let stringMessage = JSON.stringify(jsonPacket);
      let message = Trytes.encodeTextAsTryteString(stringMessage);
      let transfers = [{ value: 0, address: this.address, message: message }];
      let trytes = await this.iota.prepareTransfers(this.seed, transfers);
      let bundle = await this.iota.sendTrytes(trytes, 3, 14);
    },
    findChildren(address) {
      let buffer = [];
      for (let x in this.posts) {
        if (this.posts[x].referenceAddress == address) {
          buffer.push(this.posts[x]);
        }
      }
      return buffer;
    },
    resort(level, address) {
      let children = this.findChildren(address);
      for (let x of children) {
        x.depth = level;
        this.allposts.push(x);
        this.resort(level + 1, x.commentsAddress);
      }
    },
    async loadThreads() {
      let response = await this.iota.findTransactionObjects({
        addresses: [this.address]
      });
      this.allposts = [];
      this.posts = [];
      for (let x of response) {
        try {
          let toConvert = x.signatureMessageFragment.slice(0, -1);
          toConvert = Trytes.decodeTextFromTryteString(toConvert);
          toConvert = toConvert.replace(/\u0000/g, "");
          toConvert = JSON.parse(toConvert);
          toConvert.timestamp = x.timestamp;
          this.posts.push(toConvert);
        } catch (e) {}
      }
      this.commmentCount = response.length;
      this.posts.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
      this.resort(0, "");
    },
    async loadHeader() {
      let response = await this.iota.getTransactionObjects([this.parent]);

      let x = response[0];
      let toConvert = x.signatureMessageFragment.slice(0, -1);
      toConvert = Trytes.decodeTextFromTryteString(toConvert);
      toConvert = toConvert.replace(/\u0000/g, "");
      toConvert = JSON.parse(toConvert);
      this.parentTitle = toConvert.title;
      this.parentText = toConvert.text;
    },
    replyFunc(val, index) {
      if (this.replyActive == index) {
        this.replyActive = -1;
      } else {
        this.replyActive = index;
        this.reply = val.commentsAddress;
      }
    },
    async postReply() {
      this.text = this.replyText;
      await this.createThread();
      setTimeout(async () => {
        await this.loadThreads();
        this.replyActive = -1;
        this.text = "";
        this.replyText = "";
      }, 1000);
    },
    async postThread() {
      this.load = true;
      setTimeout(async () => {
        await this.createThread();
        setTimeout(async () => {
          await this.loadThreads();
          this.load = false;
          this.text = "";
          this.replyText = "";
        }, 1000);
      });
    }
  },
  filters: {
    shortenName(val) {
      return val.slice(0, 3);
    }
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    seed() {
      return this.$store.state.seed;
    }
  },
  async mounted() {
    this.iota = iotaLibrary.composeAPI({
      provider: "https://nodes.thetangle.org:443"
    });

    this.address = this.$route.query.comments;
    this.parent = this.$route.query.parent;

    if (this.$route.params) {
      this.parentTitle = this.$route.params.title;
      this.parentText = this.$route.params.text;
    }

    this.loadThreads();
    this.loadHeader();
  }
};
</script>

<style lang="less">
.nudgeRight {
  margin-left: 3px;
}
</style>
