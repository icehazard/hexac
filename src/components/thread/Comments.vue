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
          <h1>Comments</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div v-for="(post, index) in allposts" :key="index" class="my-1" :to="{ name: 'comments', params: post }">
            <v-card>
              <div class="d-flex align-center">
                <v-divider v-for="index in post.depth" :key="index" vertical class="ml-6"></v-divider>
               
                <v-avatar :color="colours[Math.floor(Math.random() * colours.length)]" size="30" class="ml-3">
                  <span class="white--text overline nudgeRight">{{ post.account | shortenName }}</span>
                </v-avatar>
                <v-card-text class="ml-3 body-2 font-weight-light pa-5">
                  {{ post.text }}
                </v-card-text>
              </div>
              <div class="d-flex ">
             
                 <v-divider v-for="index in post.depth" :key="index" vertical class="ml-6"></v-divider>
                  <v-divider class="ml-6" vertical></v-divider>
                <v-btn small class="transparent grey--text">
                  <v-icon> mdi-arrow-up-bold</v-icon>
                </v-btn>
                <div class="overline d-flex align-center">{{ Math.floor(Math.random() * 1000) }}</div>
                <v-btn small class="transparent grey--text">
                  <v-icon> mdi-arrow-down-bold</v-icon>
                </v-btn>
                <div class="overline d-flex align-center grey--text">({{ Math.floor(Math.random() * 1000) }}/{{ Math.floor(Math.random() * 1000) }})</div>
                <v-btn small class="transparent grey--text">
                  <v-icon small left>mdi-message</v-icon>
                  <div class="overline" @click.prevent="replyFunc(post, index)">{{ post.commments }} Reply</div>
                </v-btn>

                <!-- <v-btn      {{index}}ddd-btn small class="transparent overline grey--text">  comments </v-btn> -->
                <v-btn small class="transparent ">
                  <timeago class="overline grey--text" :auto-update="60" :datetime="new Date(post.timestamp * 1000)"></timeago>
                </v-btn>
                <v-btn small class="transparent grey--text">
                  <v-icon small left>mdi-account</v-icon>
                  <div class="overline">By {{ post.account }}</div>
                </v-btn>
                <v-btn small class="transparent grey--text">
                  <v-icon small left>mdi-share</v-icon>
                  <div class="overline">Share</div>
                </v-btn>
                <v-btn small class="transparent grey--text">
                  <v-icon small left>mdi-star</v-icon>
                  <div class="overline">Save</div>
                </v-btn>
              </div>
            </v-card>
            <v-card v-if="index == replyActive">
              <v-card-text>
                <v-container fluid>
                  <v-row>
                    <v-col>
                      <v-textarea v-model="replyText" outlined></v-textarea>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex justify-end  my-n10">
                      <v-btn @click="postReply()" color="primary">Reply</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
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
    replyText: "",
    reply: "",
    replyActive: -1,
    colours: ["blue", "green", "brown", "primary", "amber", "purple"],
  }),
  methods: {
    async createThread() {
      let commentsAddress = await this.iota.getNewAddress(this.seed, { index: Math.random() * 1000000000000000000, total: 1 });
      let jsonPacket = { text: this.text, commentsAddress: commentsAddress[0], account: this.account, referenceAddress: this.reply };
      let stringMessage = JSON.stringify(jsonPacket);
      let message = Converter.asciiToTrytes(stringMessage);
      let transfers = [{ value: 0, address: this.address, message: message }];
      let trytes = await this.iota.prepareTransfers(this.seed, transfers);
      let bundle = await this.iota.sendTrytes(trytes, 3, 10);

      this.loadThreads();
      this.text = "";
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
        this.allposts.push(x)
        this.resort(level + 1, x.commentsAddress);
      }
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
          toConvert.timestamp = x.timestamp;
          this.posts.push(toConvert);
        } catch (e) {}
      }
      this.commmentCount = this.posts.length;
      this.posts.sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));
      this.resort(0, "");
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
    replyFunc(val, index) {
      if (this.replyActive == index) {
        this.replyActive = -1;
      } else {
        this.replyActive = index;
        this.reply = val.commentsAddress;
      }
    },
    postReply() {
      this.text = this.replyText;
      this.createThread();
      this.replyActive = -1;
      this.allposts = [];
      this.loadThreads()
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

    this.loadThreads();
    this.loadHeader();
  },
};
</script>

<style lang="less">
.nudgeRight {
  margin-left: 3px;
}
</style>
