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
                        <el-menu-item index="1-1" @click="selected_sorting_algorithm = insertion_sort()">Insertion
                            Sort</el-menu-item>
                        <el-menu-item index="1-2" @click="selected_sorting_algorithm = bubble_sort()">Bubble
                            Sort</el-menu-item>
                        <el-menu-item index="1-3" @click="selected_sorting_algorithm = select_sort()">Selection
                            Sort</el-menu-item>
                        <el-menu-item index="1-4" @click="selected_sorting_algorithm = hill_sort()">Hill Sort</el-menu-item>
                        <el-menu-item index="1-5" @click="selected_sorting_algorithm = quick_sort(0, n - 1)">Quick
                            Sort</el-menu-item>
                        <el-menu-item index="1-6" @click="selected_sorting_algorithm = heap_sort()">Heap Sort</el-menu-item>
                        <el-menu-item index="1-7" @click="selected_sorting_algorithm = merge_sort(0, n - 1)">Merge
                            Sort</el-menu-item>
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
                    <el-button type="primary" @click="start_timer()" v-if="stop">start</el-button>
                    <el-button type="danger" @click="stop_timer()" v-if="start">stop</el-button>
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
import { ref, watch } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import * as echarts from "echarts" //柱状图包
import { ElNotification } from 'element-plus'

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
                `Insertion sort: Worst complexity: O(n ^ 2) Optimal complexity: O(n) Average complexity: O(n ^ 2)`,
                `Bubble sort: Worst complexity: O(n ^ 2) Optimal complexity: O(n) Average complexity: O(n ^ 2)`,
                `Selection sort: Worst complexity: O(n ^ 2) Optimal complexity: O(n ^ 2) Average complexity: O(n ^ 2)`,
                `Hill sort: unstable algorithm Optimal complexity: O(n ^ 2) Optimal worst complexity : O(n(logn)^2)`,
                `Thank you for your support`
            ],
            QuestionFilled: QuestionFilled,
            selected_sorting_algorithm: null,
            myChart: null,
            timer: null,
            start: false,
            stop: true,
            option: {
                xAxis: {
                    data: []
                },
                yAxis: {},
                series: [
                    {
                        type: "bar", //形状为柱状图
                        data: []
                    }
                ]
            }
        };
    },
    mounted() {
        this.initEcharts();
    },
    // watch: {
    //     array: {
    //         handler() {
    //             console.log('array变化');
    //             this.option.xAxis.data = this.array;
    //             this.option.series[0].data = this.array;
    //             if (this.myChart != null) {
    //                 console.log(1);
    //                 this.myChart.setOption(this.option);
    //             }
    //         },
    //         immediate: true
    //     }
    // },
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
            // const option = {
            //     xAxis: {
            //         data: this.array
            //     },
            //     yAxis: {},
            //     series: [
            //         {
            //             type: "bar", //形状为柱状图
            //             data: this.array
            //         }
            //     ]
            // };
            this.option.xAxis.data = this.array;
            this.option.series[0].data = this.array;
            //if (this.n == this.array.length) {
            this.myChart = echarts.init(document.getElementById("mychart"));
            this.myChart.setOption(this.option);
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                this.myChart.resize();
            });
            //}
        },
        randomly_generated_array() {
            var i;
            for (i = 0; i < this.n; i++) {
                this.array.length = this.n;
                this.array[i] = parseInt(Math.random() * this.n) + 1;
            }
            this.initEcharts();
        },
        upload_data_manually() {
            let tmp_arr = this.manmal_input_string.split(' ');
            if (tmp_arr.length == this.n) {
                var suc = true;
                this.array.length = this.n;
                for (var i = 0; i < this.n; i++) {
                    this.array[i] = Number(tmp_arr[i]);
                    if (this.array[i] != this.array[i]) { //NaN不等于自身
                        ElNotification({
                            message: 'Illegal input, please check and re-enter',
                            type: 'error',
                        });
                        suc = false;
                        break;
                    }
                }
                if (suc)
                    this.initEcharts();
            }
            else {
                ElNotification({
                    message: 'Please enter n number',
                    type: 'warning',
                })
            }
        },
        start_timer() {
            this.start = true;
            this.stop = false;
            this.timer = setInterval(() => {
                this.option.xAxis.data = this.array;
                this.option.series[0].data = this.array;
                this.myChart.setOption(this.option);
            }, 1);
        },
        update() {
            this.option.xAxis.data = this.array;
            this.option.series[0].data = this.array;
            this.myChart.setOption(this.option);
        },
        stop_timer() {
            this.start = false;
            this.stop = true;
            clearInterval(this.timer);
            this.timer = null // 这里最好清除一下，回归默认值
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
        insertion_sort() {
            for (var i = 1; i < this.n; i++) {
                this.Comparison_times++;
                if (this.array[i] < this.array[i - 1]) {
                    let tmp = this.array[i];
                    this.array[i] = this.array[i - 1];
                    this.Swap_times++;
                    var j;
                    for (j = i - 2; j >= 0 && this.array[j] > tmp; j--) {
                        this.array[j + 1] = this.array[j];
                        this.Comparison_times++;
                        this.Swap_times++;
                    }
                    this.array[j + 1] = tmp;
                }
            }
            this.initEcharts();
        },
        bubble_sort() {
            var i, j;
            for (i = 1; i < this.n; i++) {
                for (j = 0; j < this.n - i; j++) {
                    if (this.array[j] > this.array[j + 1]) {
                        this.Swap_times++;
                        this.swap(j, j + 1);
                        this.update();
                    }
                    this.Comparison_times++;
                }
            }

        },
        select_sort() {
            for (var i = 0; i < this.n - 1; i++) {
                var pos = i;
                for (var j = i + 1; j < this.n; j++) {
                    this.Comparison_times++;
                    if (this.array[j] < this.array[pos])
                        pos = j;
                }
                this.swap(pos, i);
                this.Swap_times++;
            }
            this.initEcharts();
        },
        hill_sort() {
            for (var gap = this.n / 2; gap >= 1; gap = Math.floor(gap / 2)) {
                for (var i = gap; i < this.n; i += gap) {
                    this.Comparison_times++;
                    if (this.array[i] < this.array[i - gap]) {
                        let tmp = this.array[i];
                        var j;
                        for (j = i - gap; j >= 0 && this.array[j] > tmp; j -= gap) {
                            this.array[j + gap] = this.array[j];
                            this.Comparison_times++;
                            this.Swap_times++;
                            setTimeout(() => { this.update(); }, 500);
                        }
                        this.array[j + gap] = tmp;
                        setTimeout(() => { this.update(); }, 500);
                    }
                }
            }
            //this.initEcharts();
        },
        quick_sort(l, r) {
            if (l >= r)
                return;
            var tmp = this.array[l];
            var i = l, j = r;
            while (i != j) {
                while (this.array[j] >= tmp && j > i) {
                    this.Comparison_times++;
                    j--;
                }
                while (this.array[i] <= tmp && j > i) {
                    this.Comparison_times++;
                    i++;
                }
                if (j > i) {
                    this.swap(i, j);
                    this.Swap_times++;
                }
            }
            this.array[l] = this.array[i];
            this.array[i] = tmp;
            this.Swap_times++;
            this.quick_sort(l, i - 1);
            this.quick_sort(i + 1, r);
            this.initEcharts();
        },
        heapadj(sta, len) {
            let fa = sta;
            let child = fa * 2 + 1; //0为根需要+1
            while (child < len) {
                this.Comparison_times += 2;
                if (this.array[child + 1] > this.array[child] && child + 1 < len)
                    child++;
                if (this.array[fa] > this.array[child])
                    return;
                else {
                    this.swap(fa, child);
                    this.Swap_times++;
                    fa = child;
                    child = child * 2 + 1;
                }
            }
        },
        heap_sort() {
            for (var i = this.n / 2; i >= 0; i--)
                this.heapadj(i, this.n);
            for (var i = this.n - 1; i > 0; i--) {
                this.swap(0, i);
                this.Swap_times++;
                this.heapadj(0, i);
            }
            this.initEcharts();
        },
        merge_sort(l, r) {
            var tmp = new Array(r - l + 1);
            if (l == r)
                return;
            var mid = Math.floor((l + r) / 2);
            var i = l, j = mid + 1, pos = 0;
            this.merge_sort(l, mid);
            this.merge_sort(mid + 1, r);
            while (i <= mid && j <= r) {
                this.Comparison_times++;
                if (this.array[i] > this.array[j]) {
                    tmp[pos++] = this.array[j++];
                    this.Swap_times++;
                }
                else
                    tmp[pos++] = this.array[i++];
            }
            while (i <= mid)
                tmp[pos++] = this.array[i++];
            while (j <= r)
                tmp[pos++] = this.array[j++];
            for (var k = l; k <= r; k++)
                this.array[k] = tmp[k - l];
            this.initEcharts();
        },
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
