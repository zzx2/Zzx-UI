<template>
  <div v-if="visible" ref="dialog">
    <div v-if="visible&&!notHide" class="cover" :style="{'z-index':zIndex}" @click="handleClose" />
    <div v-if="visible&&notHide" class="cover" :style="{'z-index':zIndex}" />
    <transition name="fade">
      <div class="dialog" :style="{'width':width,minWidth:minWidth,'z-index':zIndex}">
        <header :class="{'tipsDialog':tipsDialog}">
          <p v-if="name" class="left_name">{{ name }}</p>
          <slot name="header" />
        </header>
        <main>
          <slot />
        </main>
        <footer v-if="!footerHide">
          <slot name="footer" />
        </footer>
        <div class="vicp-close" @click="handleClose"><i class="vicp-icon4" /></div>
      </div>
    </transition>

  </div>

</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '30%'
    },
    minWidth: {
      type: String,
      default: '600px'
    },
    name: {
      type: String
    },
    footerHide: {
      type: Boolean,
      default: false
    },
    tipsDialog: {
      type: Boolean,
      default: false
    },
    notHide: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 2000
    },
    beforeCloseOut: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  watch: {
    visible(val) {
      if (val) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      document.getElementById('app').appendChild(this.$el)
    })
  },
  destroyed() {
    if (this.$el) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    handleClose() {
      if (this.beforeCloseOut) {
        this.$confirm('是否要关闭此弹窗', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$emit('update:visible', false)
          this.$emit('close')
        }).catch(() => {

        })
      } else {
        this.$emit('update:visible', false)
        this.$emit('close')
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  margin: 8vh auto;
  z-index: 2000;
  background: #fff;
  // overflow: hidden;
  box-shadow: 0px 0px 5px $boxshadow_color;
  // -webkit-transform: translateZ(0);
  // transform: translateZ(0);
  animation: diaAnimate 0.5s;
  header {
    min-height: 50px;
    background: #fbfbfb;
    border-bottom: 1px solid $border_color;
    padding: 7px 24px;
    overflow: hidden;
    .left_name {
      vertical-align: middle;
      margin: 0;
      line-height: 50px;
      // padding: 0 10px;
      font-weight: 500;
    }
  }

  // 带有备注的提示框选择多客户显示在头部的提示语句
  .tipsDialog{
    display: flex;
    align-items: center;
  }
  main {
    padding: 20px;
    overflow: auto;
    background: #fff;
    max-height: 70vh;
    &::-webkit-scrollbar {
      background-color: #ddd;
      width: 8px;
      height: 8px;
      border-radius: 5px;
      -webkit-appearance: none;
    }
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 10px;
    }
    // &::-webkit-scrollbar-button{
    //    width: 5px
    // }
  }
  .vicp-close {
    position: absolute;
    right: 24px;
    top: 22px;
    .vicp-icon4 {
      position: relative;
      display: block;
      width: 20px;
      height: 20px;
      cursor: pointer;
      -webkit-transition: -webkit-transform 0.18s;
      transition: -webkit-transform 0.18s;
      transition: transform 0.18s;
      transition: transform 0.18s, -webkit-transform 0.18s;
      -webkit-transform: rotate(0);
      transform: rotate(0);
      &:hover {
        transform: rotate(90deg);
      }
      &:before {
        content: "";
        position: absolute;
        top: 8px;
        left: 2.5px;
        width: 15px;
        height: 3px;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        background-color: #666666;
      }
      &:after {
        content: "";
        position: absolute;
        top: 8px;
        left: 2.5px;
        width: 15px;
        height: 3px;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        background-color: #666666;
      }
    }
  }
  footer {
    display: flex;
    justify-content: flex-end;
    padding: 10px 20px;
    border-top: 1px solid $border_color;
    min-height: 50px;
  }
}
.cover {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.54);
  z-index: 2000;
}
@keyframes diaAnimate {
  0% {
    margin: 0 auto;
    opacity: 0;
  }
  100% {
    margin: 100px auto;
    opacity: 1;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: margin-top 0.5s, opacity 0.4s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  margin: 0 auto;
}
</style>
