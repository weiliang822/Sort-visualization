<template>
    <el-container class="layout-container-demo" style="height: 95vh">
        <el-aside style="width:25vw">
            <h1 class="mb-2">
                Sort visualization
            </h1>
            <el-menu :default-openeds="['1', '3']">
                <el-sub-menu index="1">
                    <template #title>
                        Select sort method
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="1-1">Insertion Sort</el-menu-item>
                        <el-menu-item index="1-2" @click="bubble_sort()">Bubble Sort</el-menu-item>
                        <el-menu-item index="1-3">Selection Sort</el-menu-item>
                        <el-menu-item index="1-4">Hill Sort</el-menu-item>
                        <el-menu-item index="1-5">Quick Sort</el-menu-item>
                        <el-menu-item index="1-6">Heap Sort</el-menu-item>
                        <el-menu-item index="1-7">Merge Sort</el-menu-item>
                    </el-menu-item-group>

                </el-sub-menu>
            </el-menu>
            <el-footer style="position:fixed; bottom:10px">
                <el-row><el-text>author:2154057 汪清濯</el-text></el-row>
                <el-row><el-text>Copyright:2023 汪清濯</el-text></el-row>
                <el-row><el-text> <el-link href="https://github.com/weiliang822/Sort-visualization"
                            target="_blank">Github:https://github.com/weiliang822/Sort-visualization</el-link></el-text></el-row>
            </el-footer>
        </el-aside>

        <el-container style="width:75vw">
            <el-header>
                <el-row :gutter="20">
                    <el-col :span="6">Comparison times:{{ Comparison_times }}</el-col>
                    <el-col :span="6">Swap times:{{ Swap_times }}</el-col>
                    <el-col :span="6">total time spent:{{ total_time_spent }}</el-col>
                    <el-button type="primary">start</el-button>
                    <el-button type="primary" @click="reset_times()">reset</el-button>
                    <!--帮助提示按钮-->
                    <el-tooltip effect="dark" content="click to get help">
                        <el-button :icon="QuestionFilled" circle @click="HelpdialogVisible = true"></el-button>
                    </el-tooltip>
                    <!-- 帮助信息 -->
                    <el-dialog v-model="HelpdialogVisible" title="Help">
                        <p v-for="item in Helpinfo">{{ item }}</p>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button type="primary" @click="HelpdialogVisible = false">
                                    Confirm
                                </el-button>
                            </span>
                        </template>
                    </el-dialog>
                </el-row>
            </el-header>
            <el-main>
                <div class="echart" id="mychart" :style="myChartStyle"></div>
            </el-main>

            <el-footer style="height: 25vh;">
                <!-- footer -->
                <el-form :model="form" label-position="top" v-show="select_data_source">
                    <el-form-item label="Please select the data generation method">
                        <el-button type="primary" @click="select_random_generated()">randomly generated</el-button>
                        <el-button type="primary" @click="select_manmal_input()">manual input</el-button>
                    </el-form-item>
                </el-form>
                <el-form :model="form" v-show="manmal_input">
                    <el-form-item label="Please enter the size n of the array to be sorted">
                        <el-input placeholder="input n" v-model="n" style="width: 100px" />
                    </el-form-item>
                    <el-form-item label="Please input n numbers separated by spaces">
                        <el-input placeholder="input n numbers" v-model="manmal_input_string" autosize type="textarea" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="upload_data_manually()">submit</el-button>
                        <el-button @click="return_select()">cancel</el-button>
                    </el-form-item>
                </el-form>
                <el-form :model="form" v-show="random_generated">
                    <el-form-item label="Please enter the size n of the array to be sorted">
                        <el-input placeholder="input n" v-model="n" style="width: 100px" />
                    </el-form-item>
                    <el-form-item label="The array containing n numbers is">
                        {{ array }}
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="randomly_generated_array()">start random generation</el-button>
                        <el-button @click="return_select()">cancel</el-button>
                    </el-form-item>
                </el-form>
            </el-footer>
        </el-container>
    </el-container>
</template>

<script>
import { ref } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import * as echarts from "echarts" //柱状图包

const item = {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(Array.from({ length: 20 }).fill(item))

export default {
    name: "userpage",
    data() {
        return {
            manmal_input: false,
            random_generated: false,
            select_data_source: true,
            n: 10,
            array: [10, 2, 3, 5, 1, 4, 6, 8, 9, 7],
            manmal_input_string: "",
            Comparison_times: 0,
            Swap_times: 0,
            total_time_spent: 0,
            myChartStyle: { width: "100%", height: "100%" }, //图表样式
            HelpdialogVisible: false,
            Helpinfo: [`This is a software that implements sorting visualization.`,
                `You can choose to enter the data yourself or generate it randomly. You can select a sorting method on the left menu.`,
                `Click the start button in the upper right corner to start sorting. Click the reset button to 
                reset various times.`,
                `The following is the reference time complexity of each sort:`,
                `Bubble sort: Worst complexity: O(n ^ 2) Optimal complexity: O(n) Average complexity: O(n ^ 2)`,
                `Thank you for your support`
            ],
            QuestionFilled: QuestionFilled
        };
    },
    mounted() {
        this.initEcharts();
    },
    methods: {
        select_manmal_input() {
            this.manmal_input = true;
            this.random_generated = false;
            this.select_data_source = false;
        },
        select_random_generated() {
            this.manmal_input = false;
            this.random_generated = true;
            this.select_data_source = false;
        },
        return_select() {
            this.manmal_input = false;
            this.random_generated = false;
            this.select_data_source = true;
        },
        initEcharts() {
            // 基本柱状图
            const option = {
                xAxis: {
                    data: this.array
                },
                yAxis: {},
                series: [
                    {
                        type: "bar", //形状为柱状图
                        data: this.array
                    }
                ]
            };
            if (this.n == this.array.length) {
                const myChart = echarts.init(document.getElementById("mychart"));
                myChart.setOption(option);
                //随着屏幕大小调节图表
                window.addEventListener("resize", () => {
                    myChart.resize();
                });
            }
        },
        randomly_generated_array() {
            var i;
            for (i = 0; i < this.n; i++) {
                this.array.length = this.n;
                this.array[i] = parseInt(Math.random() * this.n) + 1;
                this.initEcharts();
            }
        },
        upload_data_manually() {
            let tmp_arr = this.manmal_input_string.split(' ');
            if (tmp_arr.length == this.n)
                this.array = tmp_arr;
            this.initEcharts();
        },
        reset_times() {
            this.Comparison_times = 0;
            this.total_time_spent = 0;
            this.Swap_times = 0;
        },
        swap(i, j) {
            var tmp = this.array[i];
            this.array[i] = this.array[j];
            this.array[j] = tmp;
        },
        bubble_sort() {
            var i, j;
            for (i = 1; i < this.n; i++) {
                for (j = 0; j < this.n - i; j++) {
                    if (this.array[j] > this.array[j + 1]) {
                        this.Swap_times++;
                        this.swap(j, j + 1);
                        this.initEcharts();
                    }
                    this.Comparison_times++;
                }
            }
        }
    }
};
</script>

<style scoped>
/* .layout-container-demo .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
    border-right: none;
}

.layout-container-demo .el-main {
    padding: 0;
}

.layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
} */
</style>
