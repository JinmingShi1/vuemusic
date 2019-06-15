<template>
  <scroll class="suggest"
          :data="result"
          :pullup="true"
          @scrollToEnd="searchMore"
          ref="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
  </scroll>
</template>

<script>
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import {getSongVkey} from 'common/js/vkey'
  import {mapMutations, mapActions} from 'vuex'
  const TYPE_SINGER = 'singer';
  const perpage = 20;
export default {
  components: {
    Scroll,
    Loading
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: false
    }
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions({
      insertSong: 'insertSong'
    }),
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singer
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        let a = res.replace('callback(', '');
        let b = JSON.parse(a.substring(0, a.length - 1));
        if (b.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(b.data));
          this._checkMore(b.data);
        }
      })
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    search() {
      this.page = 1;
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        let a = res.replace('callback(', '');
        let b = JSON.parse(a.substring(0, a.length - 1));
        if (b.code === ERR_OK) {
          this.result = this._genResult(b.data);
          this._checkMore(b.data);
        }
      })
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        let b = this._normalizeSongs(data.song.list);
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((musicData) => {
        // 获取vkey
        getSongVkey(musicData.songmid).then((res) => {
          const vkey = res.data.items[0].vkey;
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData, vkey));
          }
        });
      });
      return ret;
    }
  },
  watch: {
    query() {
      this.search();
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
