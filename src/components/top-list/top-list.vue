<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {ERR_OK} from 'api/config'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'
  import {getMusicList} from 'api/rank'
  import {getSongVkey} from 'common/js/singer'
  export default {
    created() {
      this._getTopList()
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    methods: {
      _getTopList() {
        getMusicList(this.topList.id).then((res) => {
          this.songs = this._normalizeSongs(res.songlist)
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((item) => {
          const musicData = item.data;
          getSongVkey(musicData.songmid).then((res) => {
            const vkey = res.data.items[0].vkey;
            if (musicData.songid && musicData.albummid) {
              ret.push(createSong(musicData, vkey))
            }
          });
        });
        return ret;
      }
    },

    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        return this.topList.picUrl
      },
      ...mapGetters([
        'topList'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
