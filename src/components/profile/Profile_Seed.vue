<template>
  <v-card class="d-flex" color="grey darken-2 mx-3" width="1200px" height="700px">
    <v-card-text>
      <div class="d-flex">
        <div class="headline">Account Settings</div>
        <v-spacer></v-spacer>
      </div>
      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col>
          <div class="font-weight-black">
            Account Seed
          </div>
          <div class="overline">
            {{ seed }}
          </div>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn @click="changeSeed = !changeSeed" outlined>Change</v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col>
          <div class="font-weight-black">
            Display Name
          </div>
          <div class="overline">
            {{ name }}
          </div>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn @click="changeName = !changeName" outlined>Change</v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-5"></v-divider>
    </v-card-text>
    <v-card-actions class=""> </v-card-actions>
    <div>
      <v-dialog v-model="changeSeed" width="850">
        <v-card class="grey darken-4">
          <v-card-title class="headline grey darken-1" primary-title>
            Your Seed
          </v-card-title>
          <hr class="primary" />
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field v-model="newSeed" :value="seed"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey lighten-2" text @click="changeSeed = false">
              Cancel
            </v-btn>
            <v-btn color="primary" text @click="changeSeedFunc()">
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="changeName" width="850">
        <v-card class="grey darken-4">
          <v-card-title class="headline grey darken-1" primary-title>
            Display Name
          </v-card-title>
          <hr class="primary" />
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field v-model="newAccount" :value="name"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey lighten-2" text @click="changeName = false">
              Cancel
            </v-btn>
            <v-btn color="primary" text @click="changeAccountFunc()">
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      //seed: "SSTHISTHEREALLIFEISTHISJUSTFANTASYCAUGHTINALANDSLIDENOESCAPEFROMREALITYOPENYOUR9S",
      //name: "Bongito",
      changeSeed: false,
      changeName: false,
      newSeed: "",
      newAccount: "",
    };
  },
  computed: {
    seed() {
      return this.$store.state.seed;
    },
    name() {
      return this.$store.state.account;
    },
  },
  methods: {
    changeSeedFunc() {
      this.$store.commit("updateSeed", this.newSeed);
      this.newSeed = "";
      this.changeSeed = false;
    },
    changeAccountFunc() {
      this.$store.commit("updateAccount", this.newAccount);
      this.newAccount = "";
      this.changeName = false;
    },
  },
  mounted() {
    this.newSeed = this.seed;
    this.newAccount = this.name;
  },
};
</script>

<style>
.formContainer {
  width: 300px;
}
</style>
