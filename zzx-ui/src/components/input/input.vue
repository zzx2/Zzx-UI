<template>
    <input 
          type="text"
          :value="currentValue"
          @input="handleInput"
          @blur="hanldeBlur"
    />
</template>
<script>
 import Emitter from '@/mixin/emitter';
export default {
    name:'z-Input',
    mixins:[ Emitter ],
    props:{
        value:{
            type:String,
            default:''
        }
    },
    data(){
        return {
            currentValue:this.value
        }
    },
    watch:{
        value(val){
            this.currentValue=value
        }
    },
    methods:{
        handleInput(event){
            const value=event.target.value;
            this.currentValue=value;
            this.$emit('input',value);
            this.dispatch('iFormItem','on-form-change',value)
        },
        handleBlur(){
           this.dispatch('iFormItem','on-form-blur',this.currentValue)
        }
    }
    
}
</script>
