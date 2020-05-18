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
    </div>
  </v-card>
</template>