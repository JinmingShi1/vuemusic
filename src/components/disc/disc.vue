<template>
    <transition name="slide">
      <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list';
  import {mapGetters} from 'vuex';
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {newcreateSong} from 'common/js/song'
  import {getSongVkey} from 'common/js/singer'

export default {
  created() {
    if (!this.disc.dissid) {
      this.$router.push('/recommend');
      return;
    }
    this._getSonglist();
  },
  methods: {
    _getSonglist() {
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist);
        }
      })
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((musicData) => {
        // 获取vkey
        getSongVkey(musicData.mid).then((res) => {
          const vkey = res.data.items[0].vkey;
          if (musicData.id && musicData.mid) {
            ret.push(newcreateSong(musicData, vkey));
          }
        });
      });
      return ret;
    }
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl;
    },
    ...mapGetters([
      'disc'
    ])
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
