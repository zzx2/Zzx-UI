<template>
  <div>
    <label v-if="label">{{label}}</label>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
<script>

import Emitter from '@/mixin/emitter.js';
import AsyncValidator from 'async-validator';

export default {
    name:'zFromitem',
    mixins:[Emitter],
    inject: ['form'],
    props:{
        label:String,
        prop:String
    },
    data(){
      return {
          
      }
    },
    mounted(){
        if(this.prop){
            this.dispatch('zFrom','on-form-item-add',this)
            this.setRules()
        }
    },
    beforeDestroy(){
        this.dispatch('zFrom','on-form-item-remove',this)
    },
    methods:{
        setRules(){
            this.$on('on-form-blur',this.onFieldBlur)
            this.$on('on-form-input',this.onFieldChange)
        }
    }

}
</script>
