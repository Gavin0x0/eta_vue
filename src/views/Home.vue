<template>
  <div class="home">
    <AwardShow :roleId="roleId?roleId:5"/>
    <el-divider></el-divider>
    <el-row :gutter="20">
      <el-col :span="8" :xs="24" style="margin-bottom:20px">
        <Inform :roleId="roleId?roleId:5"/>
      </el-col>
      <el-col :span="16" :xs="24">
        <NumberCounter
          :stuNum="stuItemNum"
          :teaNum="teaItemNum"
          :totalNum="totalItemNum"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import NumberCounter from "../components/NumberCounter.vue";
import AwardShow from "../components/AwardShow.vue";
import Inform from "../components/Inform.vue";
import { mapGetters } from "vuex";
export default {
  name: "Home",
  components: { NumberCounter, AwardShow, Inform },
  methods: {},
  computed: {
    ...mapGetters(["stuItemNum", "teaItemNum", "totalItemNum", "roleId"]),
  },
};
</script>

<style></style>
