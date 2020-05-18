<template>
  <v-card class="d-flex" color="grey darken-3 mx-3" width="1200px" height="700px">
    <v-card-text>
      <div class="d-flex">
        <div class="headline">Create a new community</div>
        <v-spacer></v-spacer>
      </div>
      <v-divider class="my-5"></v-divider>
        <v-row>
          <v-col>
            <h1>Create a new Community</h1>
            <p class="mt-10">Community title</p>
            <v-text-field v-model="title" outlined label="Title"></v-text-field>
            <p class="">Community Description</p>
            <v-textarea v-model="text" outlined label="Text (optional)"></v-textarea>
            <v-btn @click="createThread()" :loading="load" color="primary">Submit</v-btn>
          </v-col>
        </v-row>
      <v-divider class="my-5"></v-divider>
    </v-card-text>
  </v-card>
</template>

<script>
const iotaLibrary = require("@iota/core");
const Converter = require("@iota/converter");

export default {
  name: "Community",

  data: () => ({
    seed: "SSTHISTHEREALLIFEISTHISJUSTFANTASYCAUGHTINALANDSLIDENOESCAPEFROMREALITYOPENYOUR9S",
    address: "SAWOPLDIVGGOLINCYWWORGAJ9FQNMSHTUKVBH9HQYSMMXTRKIIBINULOOWRHNWXRINMFCDFACJSVSRSOZ",
    iota: null,
    title: "",
    text: "",
    posts: [],
    commmentCount: 0,
    load: false,
    parentTitle: "",
    parentText: "",
  }),
  methods: {
    async createThread() {
      this.load = true;
      setTimeout(async () => {
        let commentsAddress = await this.iota.getNewAddress(this.seed, { index: Math.random() * 1000000000000000000, total: 1 });
        let jsonPacket = { title: this.title, text: this.text, commentsAddress: commentsAddress[0], account: this.account };
        let stringMessage = JSON.stringify(jsonPacket);
        let message = Converter.asciiToTrytes(stringMessage);
        let transfers = [
          {
            value: 0,
            address: this.address,
            message: message,
          },
        ];
        let trytes = await this.iota.prepareTransfers(this.seed, transfers);
        let bundle = await this.iota.sendTrytes(trytes, 3, 10);
        this.title = "";
        this.text = "";
      }, 0);
    },
  },
    computed: {
    account() {
      return this.$store.state.account;
    },
  },
  filters: {
    timeAgo(val) {
      return timeago.format(val * 1000);
    },
  },
  async mounted() {
    this.iota = iotaLibrary.composeAPI({
      provider: "https://nodes.comnet.thetangle.org:443",
    });
  },
};
</script>

<style lang="less"></style>
