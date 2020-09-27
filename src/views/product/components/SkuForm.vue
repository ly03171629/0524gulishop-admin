<template>
  <el-form label-width="100px" :model="skuInfo">
    <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>

    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>

    <el-form-item label="价格(元)">
      <el-input
        placeholder="SKU价格"
        type="number"
        v-model="skuInfo.price"
      ></el-input>
    </el-form-item>

    <el-form-item label="重量(千克)">
      <el-input
        placeholder="SKU重量"
        type="number"
        v-model="skuInfo.weight"
      ></el-input>
    </el-form-item>

    <el-form-item label="规格描述">
      <el-input
        placeholder="规格描述"
        type="textarea"
        rows="4"
        v-model="skuInfo.skuDesc"
      ></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item
          :label="attrInfo.attrName"
          v-for="(attrInfo, index) in attrInfoList"
          :key="attrInfo.id"
        >
          <el-select placeholder="请输入" v-model="attrInfo.attrIdValueId">
            <el-option
              :label="attrValue.valueName"
              :value="`${attrInfo.id}:${attrValue.id}`"
              v-for="(attrValue, index) in attrInfo.attrValueList"
              :key="attrValue.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item
          :label="spuSaleAttr.saleAttrName"
          v-for="(spuSaleAttr, index) in spuSaleAttrList"
          :key="spuSaleAttr.id"
        >
          <el-select placeholder="请输入" v-model="spuSaleAttr.saleAttrValueId">
            <el-option
              :value="spuSaleAttrValue.id"
              v-for="(spuSaleAttrValue,
              index) in spuSaleAttr.spuSaleAttrValueList"
              :key="spuSaleAttrValue.id"
              :label="spuSaleAttrValue.saleAttrValueName"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片列表">
      <el-table
        border
        style="width: 100%"
        :data="spuImageList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="图片" width="width">
          <template slot-scope="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 80px" />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <el-button
              v-if="row.isDefault === '0'"
              type="primary"
              size="mini"
              @click="setDefault(row)"
              >设为默认</el-button
            >
            <el-tag v-else type="success">默认</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancelback">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spu: {},

      skuInfo: {
        category3Id: 0, //从父组件传递过来的
        spuId: 0,
        tmId: 0,

        price: 0, //价格	   需要v-model收集的
        skuDesc: "", //描述
        skuName: "", //名称
        weight: "", //重量
        skuDefaultImg: "", //默认图片路径

        skuAttrValueList: [
          //收集到的平台属性值列表
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ], //需要自己想办法收集的 平台属性
        skuSaleAttrValueList: [
          // {
          //   saleAttrValueId: 0,
          // },
        ], //销售属性

        skuImageList: [
          // {
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   spuImgId: 0,
          // },
        ], //图片列表
      },

      attrInfoList: [], //平台属性的列表
      spuSaleAttrList: [],
      spuImageList: [], //用来展示spu的图片列表
      selectedImgList: [], //用来收集sku的图片列表
    };
  },
  methods: {
    //取消操作
    cancelback(){
      this.$emit('update:visible', false) //返回到spu列表页面
      this.resetData()
    },

    //保存操作
    async save() {
      //拿参数
      let {
        skuInfo,
        spu,
        attrInfoList,
        spuSaleAttrList,
        selectedImgList,
      } = this;
      //整理参数
      //1、整理父组件传递过来的
      skuInfo.category3Id = spu.category3Id;
      skuInfo.spuId = spu.id;
      skuInfo.tmId = spu.tmId;

      //2、整理sku平台属性值列表
      //filter是过滤出符合条件的项组成新数组  ，用这个filter不能一次性搞定，得过滤出来然后再去把过滤出来的数组每一项去切割生成对象
      skuInfo.skuAttrValueList = attrInfoList.reduce((pre,item)=>{
        if(item.attrIdValueId){
          let [attrId,valueId] = item.attrIdValueId.split(':')
          let obj = {
            attrId,
            valueId
          }
          pre.push(obj)
        }
        return pre
      },[])
      //3、整理sku销售属性值列表
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((pre,item)=>{
        if(item.saleAttrValueId){
          let {saleAttrValueId} = item
          let obj = {
            saleAttrValueId
          }
          pre.push(obj)
        }
        return pre
      },[])

      //4、整理sku图片列表

      //目前我们的格式
      // id:6761
      // imgName:"0f3254794840c47e.png"
      // imgUrl:"http://182.92.128.115:8080/group1/M00/00/56/rBFUDF9oY7mAONmuAAL1X4gVWEE499.png"
      // isDefault:"0"
      // spuId:1504

      //要求的格式
      // imgName: "string",
      // imgUrl: "string",
      // isDefault: "string",
      // spuImgId: 0,

      skuInfo.skuImageList = selectedImgList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        }
      })

      // console.log(skuInfo)
      //发请求
      const result = await this.$API.sku.addUpdate(skuInfo)
      if(result.code === 200){
        //成功
        this.$message.success('保存sku成功')
        this.resetData() //清空data的数据
        this.$emit('update:visible', false) //返回到spu列表页面
      }else{
        //失败
        this.$message.success('保存sku失败')
      }
    },

    //清空data的所有数据
    resetData(){
      this.spu = {}
      this.skuInfo = {
        category3Id: 0, //从父组件传递过来的
        spuId: 0,
        tmId: 0,

        price: 0, //价格	   需要v-model收集的
        skuDesc: "", //描述
        skuName: "", //名称
        weight: "", //重量
        skuDefaultImg: "", //默认图片路径

        skuAttrValueList: [
          //收集到的平台属性值列表
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ], //需要自己想办法收集的 平台属性
        skuSaleAttrValueList: [
          // {
          //   saleAttrValueId: 0,
          // },
        ], //销售属性

        skuImageList: [
          // {
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   spuImgId: 0,
          // },
        ], //图片列表
      }
      this.attrInfoList = [] //平台属性的列表
      this.spuSaleAttrList = []
      this.spuImageList = []//用来展示spu的图片列表
      this.selectedImgList = [] //用来收集sku的图片列表
    },


    //设置默认图片并且收集默认图片
    setDefault(row) {
      this.spuImageList.forEach((item) => (item.isDefault = "0"));
      row.isDefault = "1";
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },

    //收集选中的图片列表
    handleSelectionChange(val) {
      // console.log(val)
      // this.spuImageList = val  //不能这么干  因为我们把收集到的图片列表直接覆盖了原本展示的图片列表
      this.selectedImgList = val;
    },

    async initAddSkuFormData(row, category1Id, category2Id) {
      this.spu = row;
      // http://localhost:9529/dev-api/admin/product/attrInfoList/2/13/61
      const promise1 = this.$API.attr.getList(
        category1Id,
        category2Id,
        row.category3Id
      );
      // http://localhost:9529/dev-api/admin/product/spuSaleAttrList/1529
      const promise2 = this.$API.sku.getSpuSaleAttrList(row.id);
      // http://localhost:9529/dev-api/admin/product/spuImageList/1529
      const promise3 = this.$API.sku.getSpuImageList(row.id);
      const result = await Promise.all([promise1, promise2, promise3]);
      this.attrInfoList = result[0].data;
      this.spuSaleAttrList = result[1].data;

      let spuImageList = result[2].data;

      spuImageList.forEach((item) => (item.isDefault = "0")); //为了去做默认图片

      this.spuImageList = spuImageList;
    },
  },
};
</script>


