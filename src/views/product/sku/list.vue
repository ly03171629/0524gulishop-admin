<template>
  <div>
    <h2>我爱你赵丽颖</h2>
    <Child1></Child1>
  </div>
</template>

<script>
import Child1 from '@/views/product/sku/Child1'
export default {
  name: 'Sku',
  components:{
    Child1
  }
}
</script>


<style lang="scss" scoped>
  h2{
    color:hotpink
  }
</style>




