<template>
  <div id="home">
    <h1 class="title font-weight-regular mt-2">
      {{ activeSection === 1 ? 'Home' : 'Settings' }}
    </h1>

    <div v-show="activeSection === 1">
      <!-- Input form -->
      <v-form
        ref="form"
        @submit.prevent="GetProfile">
        <v-layout
          mt-4
          justify-center>
          <v-flex
            xs9
            md6
            lg5>
            <v-text-field
              v-model="userInput"
              :clearable="!isDownloading"
              solo
              :readonly="fetchingMedia"
              :loading="fetchingMedia"
              :rules="rules"
              placeholder="Instagram username" />
          </v-flex>

          <v-flex
            xs2
            md1>
            <v-btn
              color="primary"
              block
              large
              class="attached-btn my-0"
              :loading="fetchingMedia"
              @click="GetProfile">
              <span>Start</span>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>

      <!-- Media type toggles -->
      <v-layout
        row
        wrap
        justify-center>
        <v-flex
          xs5
          sm4>
          <v-btn-toggle
            v-model="mediatype"
            class="mediatype-toggle"
            multiple
            mandatory>
            <v-btn
              :disabled="isDownloading"
              :value="1">
              <span>Images</span>
            </v-btn>
            <v-btn
              :disabled="isDownloading"
              :value="2">
              <span>Videos</span>
            </v-btn>
          </v-btn-toggle>
        </v-flex>
      </v-layout>

      <!-- More Options Icon -->
      <v-layout
        justify-center
        mt-3
        column>
        <v-flex>
          <span
            class="secondary--text body-2"
            :class="{ 'error--text' : filtersActive, 'text--lighten-4': !filtersActive }">
            {{ filtersActive ? 'Active' : 'More' }}
          </span>
        </v-flex>
        <v-flex>
          <v-icon
            id="more-options"
            class="px-5 py-2"
            :class="{ 'closed': !showMoreOptions }"
            :disabled="isDownloading"
            @click.native="ToggleMoreOptions">
            {{ showMoreOptions ? '$vuetify.icons.up' : '$vuetify.icons.down' }}
          </v-icon>
        </v-flex>
      </v-layout>

      <!-- More options  -->
      <div
        v-if="showMoreOptions">
        <v-layout
          justify-center
          row>
          <v-flex
            mb-3
            xs5
            sm4>
            <v-dialog
              full-width
              width="300">
              <v-text-field
                slot="activator"
                v-model="fromDate"
                label="Newest"
                hint="Default - Today"
                persistent-hint
                clearable
                prepend-inner-icon="$vuetify.icons.event"
                readonly />
              <v-date-picker
                v-model="fromDate"
                :min="toDate || '2010-10-06'"
                :max="new Date().toISOString()"
                no-title
                scrollable />
            </v-dialog>
          </v-flex>
        </v-layout>

        <v-layout
          justify-center
          row>
          <v-flex
            mb-3
            xs5
            sm4>
            <v-dialog
              full-width
              width="300">
              <v-text-field
                slot="activator"
                v-model="toDate"
                label="Oldest"
                hint="Default - October 06, 2010"
                persistent-hint
                clearable
                prepend-inner-icon="$vuetify.icons.event"
                readonly />
              <v-date-picker
                v-model="toDate"
                min="2010-10-06"
                :max="fromDate || new Date().toISOString()"

                no-title
                scrollable />
            </v-dialog>
          </v-flex>
        </v-layout>

        <v-layout
          justify-center
          row>
          <v-flex
            mb-3
            xs5
            sm4>
            <v-text-field
              v-model="maxPosts"
              label="Max Downloads"
              hint="Default - unlimited"
              persistent-hint
              clearable
              prepend-inner-icon="$vuetify.icons.image"
              type="number" />
          </v-flex>
        </v-layout>
      </div>

      <!-- Downloading stats -->
      <v-layout
        v-if="(fetchingMedia || downloadingPosts) && !showMoreOptions"
        mt-3
        mb-4
        justify-center
        row>
        <v-flex xs3>
          <v-card
            flat
            color="transparent"
            height="100%">
            <div class="headline">
              Links
            </div>
            <div class="headline">
              {{ pendingDownloads.length }}
            </div>
          </v-card>
        </v-flex>
        <v-flex xs3>
          <v-progress-circular
            :rotate="-90"
            :width="12"
            :size="120"
            color="primary"
            :value="downloadProgress">
            <span
              class="title font-weight-regular"
              @click="showDownloadProgress = !showDownloadProgress">
              {{ showDownloadProgress ? `${downloadProgress}%` : currentIndex }}
            </span>
          </v-progress-circular>
        </v-flex>
        <v-flex xs3>
          <v-card
            flat
            color="transparent"
            height="100%">
            <div class="headline">
              Failed
            </div>
            <div class="headline">
              {{ failedDownloads.length }}
            </div>
          </v-card>
        </v-flex>
      </v-layout>

      <!-- Cancel Download Button -->
      <v-layout
        v-if="isDownloading"
        justify-center>
        <v-flex xs11>
          <v-btn
            color="error"
            class="ma-0"
            flat
            :ripple="false"
            @click="CancelDownload">
            Cancel
          </v-btn>
        </v-flex>
      </v-layout>
    </div>

    <!-- Settings Page -->
    <div v-show="activeSection === 2">
      <div>
        <v-subheader>Save Folder</v-subheader>
        <v-layout justify-center>
          <v-flex
            xs9
            md6
            lg5>
            <v-text-field
              readonly
              solo
              hide-details
              :value="saveFolder" />
          </v-flex>

          <v-flex
            xs2
            md1>
            <v-btn
              color="primary"
              block
              large
              class="attached-btn my-0"
              @click="ChangeSaveFolder">
              <span class="text-none">Change</span>
            </v-btn>
          </v-flex>
        </v-layout>

        <v-subheader>Download Timeout (Seconds)</v-subheader>
        <v-layout
          justify-center
          mt-2>
          <v-flex
            xs11
            md7
            lg6>
            <v-slider
              v-model="timeout"
              always-dirty
              min="10"
              max="60"
              step="5"
              ticks
              thumb-label="always" />
          </v-flex>
        </v-layout>
      </div>
    </div>

    <!-- Bottom Nav -->
    <v-bottom-nav
      :active.sync="activeSection"
      :value="true"
      absolute
      mandatory
      color="transparent">
      <v-btn
        color="primary"
        flat
        :value="1">
        <span>Home</span>
        <v-icon>$vuetify.icons.home</v-icon>
      </v-btn>

      <v-btn
        color="primary"
        flat
        :value="2">
        <span>Settings</span>
        <v-icon>$vuetify.icons.settings</v-icon>
      </v-btn>
    </v-bottom-nav>
  </div>
</template>

<script>
const { dialog } = require('electron').remote
const axios = require('axios')
const createHash = require('create-hash')
const path = require('path')
const fs = require('fs-extra')

export default {
  name: 'Home',
  data () {
    return {
      userInput: '',
      activeSection: 1,
      mediatype: [1, 2],
      showMoreOptions: false,
      rules: [
        value => !!value || 'Required.',
        value => (value && (usernameRegex.test(value) || postRegex.test(value))) || 'Unknown format'
      ],
      fromDate: null,
      toDate: null,
      rhxGis: null,
      userid: null,
      maxPosts: null,
      mediaCount: 0,
      currentIndex: 0,
      downloadedCount: 0,
      pendingDownloads: [],
      failedDownloads: [],
      showDownloadProgress: true,
      fetchingMedia: false,
      downloadingPosts: false
    }
  },
  computed: {
    saveFolder: {
      get: function () {
        return this.$store.getters.getSaveFolder
      },
      set: function (value) {
        this.$store.dispatch('updateSaveFolder', value)
      }
    },
    timeout: {
      get: function () {
        return this.$store.getters.getTimeout
      },
      set: function (value) {
        this.$store.dispatch('updateTimeout', value)
      }
    },
    filtersActive () {
      return this.maxPosts !== null || this.fromDate !== null || this.toDate !== null
    },
    downloadProgress () {
      return Math.round(((this.downloadedCount + this.failedDownloads.length) / this.pendingDownloads.length) * 100) || 0
    },
    isDownloading () {
      return this.fetchingMedia || (this.downloadingPosts && (this.downloadedCount + this.failedDownloads.length) !== this.pendingDownloads.length)
    }
  },
  watch: {
    maxPosts () {
      if (this.maxPosts != null) {
        this.maxPosts = Number(this.maxPosts)
      }
    }
  },
  methods: {
    GetProfile () {
      if (!this.$refs.form.validate()) return

      this.ResetUI()

      axios.get(`https://www.instagram.com/${this.userInput}/`)
        .then((response) => {
          const body = response.data

          const isPrivate = RegExp('"is_private":([a-z]*)', 'g').exec(body)[1]

          if (isPrivate === 'true') {
            this.fetchingMedia = false
            return this.$swal('Error', 'Private accounts are not supported.', 'error')
          }

          this.rhxGis = RegExp('"rhx_gis":"([a-f0-9]{32})"', 'g').exec(body)[1]
          this.userid = RegExp('"id":"([0-9]*)"', 'g').exec(body)[1]
          this.mediaCount = RegExp('"edge_owner_to_timeline_media":{"count":([0-9]*)', 'g').exec(body)[1]

          this.IterateProfile()
        })
        .catch(() => {
          this.$swal('Error', 'Page not found.', 'error')
          this.fetchingMedia = false
        })
    },
    IterateProfile (cursor = null) {
      if (!this.fetchingMedia) return

      const variables = JSON.stringify(this.QueryVariables(this.userid, this.mediaCount, cursor))

      axios.get(`https://www.instagram.com/graphql/query/?query_hash=f2405b236d85e8296cf30347c9f08c2a&variables=${variables}`, {
        headers: {
          'X-Instagram-GIS': this.GenerateGIS(variables),
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
        .then((response) => {
          const timelineMedia = response.data.data.user.edge_owner_to_timeline_media

          const pageInfo = timelineMedia.page_info
          const edges = timelineMedia.edges

          this.mediaCount -= edges.length

          edges.forEach((media) => {
            const username = media.node.owner.username
            const userid = media.node.owner.id
            const mediatype = media.node.__typename
            const epochTimestamp = new Date(media.node.taken_at_timestamp * 1000).setHours(0, 0, 0, 0)
            const timestamp = new Date(media.node.taken_at_timestamp * 1000).toISOString().substring(0, 10)
            const shortcode = media.node.shortcode

            const epochToday = new Date(Date.now()).setHours(0, 0, 0, 0)

            const minDate = this.fromDate ? new Date(this.fromDate).setHours(0, 0, 0, 0) : epochToday
            const maxDate = this.toDate ? new Date(this.toDate).setHours(0, 0, 0, 0) : 1286312400000

            if (epochTimestamp > minDate) {
              return
            }

            if (epochTimestamp < maxDate) {
              this.mediaCount = 0
              return
            }

            const getimages = this.mediatype.includes(1)
            const getvideos = this.mediatype.includes(2)

            if (mediatype === 'GraphImage' && getimages) {
              this.pendingDownloads.push({
                userid,
                username,
                id: media.node.id,
                link: media.node.display_resources.reverse()[0].src,
                timestamp,
                shortcode,
                video: false
              })
            }
            if (mediatype === 'GraphVideo' && getvideos) {
              this.pendingDownloads.push(
                {
                  userid,
                  username,
                  id: media.node.id,
                  link: media.node.video_url,
                  timestamp,
                  shortcode,
                  video: true
                })
            }
            if (mediatype === 'GraphSidecar') {
              media.node.edge_sidecar_to_children.edges.forEach(edge => {
                if (edge.node.__typename === 'GraphImage' && getimages) {
                  this.pendingDownloads.push({
                    userid,
                    username,
                    id: edge.node.id,
                    link: edge.node.display_resources.reverse()[0].src,
                    timestamp,
                    shortcode,
                    video: false
                  })
                } else if (edge.node.__typename === 'GraphVideo' && getvideos) {
                  this.pendingDownloads.push(
                    {
                      userid,
                      username,
                      id: edge.node.id,
                      link: edge.node.video_url,
                      timestamp,
                      shortcode,
                      video: true
                    })
                }
              })
            }
          })

          if (this.maxPosts !== null && this.maxPosts > 0 && this.pendingDownloads.length >= this.maxPosts) {
            this.mediaCount = 0
            this.pendingDownloads.splice(this.maxPosts, this.pendingDownloads.length)
          }

          if (pageInfo.has_next_page && this.mediaCount !== 0) {
            return this.IterateProfile(pageInfo.end_cursor)
          }

          this.fetchingMedia = false
          this.downloadingPosts = true

          const parentFolder = path.join(this.saveFolder, this.username)

          if (!fs.existsSync(parentFolder)) {
            fs.mkdirpSync(parentFolder)
          }

          this.DownloadPost()
        })
        .catch(() => {
          this.$swal('Error', 'Request Error', 'error')
          this.fetchingMedia = false
        })
    },
    DownloadPost () {
      if (!this.downloadingPosts) return

      const post = this.pendingDownloads[this.currentIndex]

      if (post == null) return

      const filename = path.resolve(this.saveFolder, post.username, `${post.username}.${post.timestamp}.${post.id}.${post.video ? 'mp4' : 'jpg'}`)

      if (fs.existsSync(filename)) {
        this.downloadedCount++
        return this.NextPost()
      }

      axios.get(post.link, {
        validateStatus: status => {
          return status === 200
        },
        timeout: this.timeout * 1000,
        responseType: 'arraybuffer'
      })
        .then(response => {
          fs.writeFileSync(path.resolve(filename), Buffer.from(response.data))

          if (response.status === 200) {
            this.downloadedCount++
          }
        })
        .catch(() => {
          this.failedDownloads.push(post.link)
        })
        .then(() => {
          this.NextPost()
        })
    },
    NextPost () {
      this.currentIndex++
      this.DownloadPost()
    },
    CancelDownload () {
      this.fetchingMedia = false
      this.downloadingPosts = false
    },
    QueryVariables (id, count = 50, cursor = null) {
      if (cursor) {
        return { id, first: count > 50 ? 50 : count, after: cursor }
      }

      return { id, first: count > 50 ? 50 : count }
    },
    GenerateGIS (queryVariables) {
      return createHash('md5').update(`${this.rhxGis}:${queryVariables}`, 'utf8').digest('hex')
    },
    ChangeSaveFolder () {
      dialog.showOpenDialog({
        properties: ['openDirectory']
      }, (selectedPath) => {
        if (selectedPath == null) return
        this.saveFolder = selectedPath[0]
      })
    },
    ResetUI () {
      this.showMoreOptions = false
      this.currentIndex = 0
      this.downloadedCount = 0
      this.pendingDownloads.splice(0, this.pendingDownloads.length)
      this.failedDownloads.splice(0, this.failedDownloads.length)

      this.fetchingMedia = true
      this.downloadingPosts = false
    },
    ToggleMoreOptions () {
      this.showMoreOptions = !this.showMoreOptions
    }
  }
}
</script>

<style lang="scss" scoped>
.attached-btn {
  height: 48px;
  margin-left: -1px;
}

.v-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.mediatype-toggle {
  width: 100%;

  .v-btn:not(.v-btn--icon):not(.v-btn--flat) {
    width: calc(100% / 2);
    background-color: white;
    color: $primary;
    opacity: 1;

    &.v-btn--active {
      background-color: $primary;

      span {
        color: white;
      }
    }
  }
}

#more-options {
  cursor: pointer;

  &.closed {
    animation: mover 0.65s infinite alternate;
  }
}

@keyframes mover {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-4px);
  }
}
</style>
