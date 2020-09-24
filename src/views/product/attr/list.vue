<template>
  <div>
    <el-card>
      <CategorySelector @handlerCategory="handlerCategory"></CategorySelector>
    </el-card>

    <el-card style="margin-top: 20px">
      <div v-show="isShowList">
        <!-- 列表数据展示的内容 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddDiv"
          >添加属性</el-button
        >
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
          ></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="warning"
                icon="el-icon-edit"
                title="修改属性"
                size="mini"
                @click="showUpdateDiv(row)"
              ></HintButton>
              <HintButton
                type="danger"
                icon="el-icon-delete"
                title="删除属性"
                size="mini"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShowList">
        <!-- 添加和修改的页面 -->
        <el-form :inline="true" :model="attr">
          <el-form-item label="属性名">
            <el-input
              v-model="attr.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>

        <el-table
          :data="attr.attrValueList"
          style="width: 100%; margin: 20px 0"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="attr.attrValueList.splice($index,1)">
                <!-- <el-button slot="reference">删除</el-button> -->
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除属性值"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import { Row } from "element-ui";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],

      isShowList: true,

      attr: {
        attrName: "",
        categoryLevel: 3,
        attrValueList: [],
        categoryId: 0,
      },

      // attr: {
      //   attrName: "string",
      //   attrValueList: [
      //     {
      //       attrId: 0,
      //       id: 0,
      //       valueName: "string",
      //     },
      //   ],
      //   categoryId: 0,
      //   categoryLevel: 0,
      //   id: 0,
      // },
    };
  },
  methods: {
    //最终需要保存发请求
    async save(){
      //拿参数
      let attr = this.attr
      //整理参数
      // 1、如果属性值没有值 那就是空串，删除这个属性值对象
      // 2、去除参数中多余的参数，比如自己加的isEdit

      //功能      过滤出数组当中符合自己条件的项
      //参数      回调函数  回调函数的参数（item index arr）  回调函数的返回值：布尔值（true和false）
      //返回值    原数组每一项都会调用回调函数，回调函数返回为true的项组成的新数组

      attr.attrValueList = attr.attrValueList.filter(item => {
        //过滤每一项，如果这一项的属性值名称不为空串，顺变就把这一项的isEdit删掉，然后把这一项放在新数组当中
        if(item.valueName !== ''){
          delete item.isEdit
          return true
        }
      })

      
      // 3、如果属性当中属性值列表没有属性值对象 不发请求
      if(attr.attrValueList.length === 0) return 

      //发请求
      const result = await this.$API.attr.addOrUpdate(attr)
      
      if(result.code === 200){
        //成功
        //1、提示
        this.$message.success('保存属性成功')
        //2、返回列表页
        this.isShowList = true
        //3、重新获取属性列表数据
        this.getAttrList()
      }else{
        //失败
        this.$message.error('保存属性失败')
      }
      
    },

    //input失去焦点或者回车之后变为查看模式
    toLook(row) {
      //失去焦点的时候或者回车之后我们要判断用户输入的数据合法性
      // 数据必须有
      if (row.valueName.trim() === "") {
        this.$message.error("输入的数据不能为空");
        row.valueName = "";
        return;
      }
      // 除了是自身以外，不能有相同的

      // [
      //   {valueName},{valueName},{valueName}
      // ]

      let isRepeat = this.attr.attrValueList.some((item) => {
        if (item !== row) {
          return item.valueName === row.valueName;
        }
      });

      if (isRepeat) {
        this.$message.error("输入的数据不能重复");
        row.valueName = "";
        return;
      }

      row.isEdit = false;
    },
    //点击span，变为编辑模式
    toEdit(row, index) {
      row.isEdit = true; //只要第一次添加是响应式，后面就可以使用点语法  也是响应式的

      //找到对应的那个input元素，然后调用focus方法
      //数据修改很快，但是页面的更新比较慢，而我们下面的操作是需要根据更新后的页面去操作的，此时必然用nextTick
      this.$nextTick(() => {
        //等待页面最近一次更新完成之后，执行回调
        this.$refs[index].focus();
      });
    },
    //addAttrValue点击添加属性值的回调
    addAttrValue() {
      //收集属性值的时候，我们做法是先属性值列表当中添加一个属性值对象
      //然后上面table就会出现一行数据（只不过都是空的）
      this.attr.attrValueList.push({
        attrId: this.attr.id,
        valueName: "", //属性值已经添加到属性值列表当中了，但是这个属性值的名称是空串为了等待用户去输入
        isEdit: true, //每一个新添加的属性值对象当中都会添加这么一个属性，代表目前这个属性值是可编辑状态（显示input）
      });

      //添加属性值的时候，input自动获取焦点

      this.$nextTick(() => {
        //等待页面最近一次更新完成之后，执行回调
        this.$refs[this.attr.attrValueList.length - 1].focus();
      });
    },
    //点击列表页的添加属性逻辑
    showAddDiv() {
      this.isShowList = false;
      //解决添加取消后再添加数据还在的bug
      this.attr = {
        attrName: "",
        categoryLevel: 3,
        attrValueList: [],
        categoryId: this.category3Id, //收集categoryId 不能在data当中去写
      };
    },

    showUpdateDiv(row) {
      this.isShowList = false;
      // this.attr = {...row} //浅拷贝
      // 对于属性名来说是没问题的，修改添加页面和列表页面的属性不是同一个对象，基本值也不是同一个值，但是对于属性值来说
      //属性值是在一个数组当中的，浅拷贝的时候，不同对象拷贝内部数组还是同一个数组，也就是说两个对象内部属性值的数组是同一个地址
      //在添加页面修改数组其实也是在修改列表页面的数组。因此浅拷贝不行，得换成深拷贝
      this.attr = cloneDeep(row);

      //对修改属性的所有属性值对象添加isEdit，标识数据
      this.attr.attrValueList.forEach((item) => {
        // item.isEdit = false  这样写的添加的属性不是响应式属性
        this.$set(item, "isEdit", false);
      });
    },

    handlerCategory({ categoryId, level }) {
      if (level === 1) {
        //子组件传递过来1级id，证明重新选择了1级分类，需要在父组件当中把原来的23级id及属性列表数组清空
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];

        this.category1Id = categoryId;
      } else if (level === 2) {
        this.category3Id = "";
        this.attrList = [];

        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getAttrList(); //发请求获取属性的数据展示
      }
    },

    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
  },
};
</script>

