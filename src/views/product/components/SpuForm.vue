<template>
  <el-form>
    <el-form-item label="SPU名称" label-width="100px">
      <el-input placeholder="SPU名称"></el-input>
    </el-form-item>

    <el-form-item label="品牌" label-width="100px">
      <el-select placeholder="请选择品牌" value="">
        <el-option value=""> </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述" label-width="100px">
      <el-input placeholder="SPU描述" type="textarea" rows="4"></el-input>
    </el-form-item>

    <el-form-item label="SPU图片" label-width="100px">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性" label-width="100px">
      <el-select placeholder="还有3没选择" value="">
        <el-option value=""> </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
      <el-table
        border
        style="width: 100%;margin-top:20px">
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="prop"
          label="属性名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="prop"
          label="属性值名称列表"
          width="width">
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
        </el-table-column>
      </el-table>
    </el-form-item>


    <el-form-item label-width="100px">
      <el-button type="primary">保存</el-button>
      <el-button @click="$emit('update:visible',false)">取消</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  name: "SpuForm",
  props:['visible'],
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>


