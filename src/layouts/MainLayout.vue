<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10" bordered>
      <q-toolbar class="constrain">
        <q-btn
          to="/camera"
          class="large-screen-only q-mr-sm"
          flat
          round
          dense
          icon="eva-camera-outline"
          size="18px"
        />
        <q-separator class="large-screen-only" vertical spaced />
        <q-toolbar-title class="text-grand-hotel text-bold">
          Quasagram
        </q-toolbar-title>
        <q-btn
          to="/"
          class="large-screen-only"
          flat
          round
          dense
          icon="eva-home-outline"
          size="18px"
        />
      </q-toolbar>
    </q-header>

    <q-footer class="bg-white" bordered>
      <div class="banner-container bg-primary">
        <div class="constrain">
          <q-banner inline-actions dense class="bg-primary text-white">
            <template v-slot:avatar>
              <q-avatar
                color="white"
                text-color="grey-10"
                icon="eva-camera-outline"
                font-size="22px"
              />
            </template>
            <b>Install Quasagram?</b>
            <template v-slot:action>
              <q-btn dense class="q-px-sm" flat label="Yes" />
              <q-btn dense class="q-px-sm" flat label="Later" />
              <q-btn dense class="q-px-sm" flat label="Never" />
            </template>
          </q-banner>
        </div>
      </div>
      <q-tabs
        class="text-grey-10 small-screen-only"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab to="/" icon="eva-home-outline" />
        <q-route-tab to="/camera" icon="eva-camera-outline" />
      </q-tabs>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  data() {
    return {};
  },
};
</script>

<style lang="sass">
.q-toolbar
  @media (min-width: $breakpoint-sm-min)
    height: 77px
.q-toolbar__title
  font-size: 30px
  @media (max-width: $breakpoint-xs-max)
    text-align: center
.q-footer
  .q-tab__icon
    font-size: 30px
</style>
