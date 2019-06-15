<template>
<transition name="slide">
  <music-list :songs="songs" :title="title" :bg-image="bgImg"></music-list>
</transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import {getSongVkey} from 'common/js/singer'

export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs: ['']
    }
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImg() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getDetail();
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer');
        return
      }
      getDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list);
        }
      })
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((item) => {
        let {musicData} = item;
        // 获取vkey
        getSongVkey(musicData.songmid).then((res) => {
          const vkey = res.data.items[0].vkey;
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData, vkey));
          }
        });
      });
      return ret;
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer-detail
  z-index 1000
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background black
  .slide-enter-active, .slide-leave-active
    transition all 0.5s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%,0 ,0)
</style>
