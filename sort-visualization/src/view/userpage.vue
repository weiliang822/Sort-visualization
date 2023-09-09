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
                        <el-menu-item index="1-1" @click="insertion_sort()">Insertion Sort</el-menu-item>
                        <el-menu-item index="1-2" @click="bubble_sort()">Bubble Sort</el-menu-item>
                        <el-menu-item index="1-3" @click="select_sort()">Selection Sort</el-menu-item>
                        <el-menu-item index="1-4" @click="hill_sort()">Hill Sort</el-menu-item>
                        <el-menu-item index="1-5" @click="quick_sort(convertToNumList(), 0, n - 1)">Quick
                            Sort</el-menu-item>
                        <el-menu-item index="1-6" @click="heap_sort()">Heap Sort</el-menu-item>
                        <el-menu-item index="1-7"
                            @click="selected_sorting_algorithm = merge_sort(convertToNumList(), 0, n - 1)">Merge
                            Sort</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
            </el-menu>
            <el-footer style="position:fixed; bottom:10px">
                <el-row><el-text>author:2154057 汪清濯</el-text></el-row>
                <el-row><el-text>Copyright © 2023-present 汪清濯</el-text></el-row>
                <el-row><el-text> <el-link href="https://github.com/weiliang822/Sort-visualization"
                            target="_blank">Github:https://github.com/weiliang822/Sort-visualization</el-link></el-text></el-row>
            </el-footer>
        </el-aside>

        <el-container style="width:75vw">
            <el-header>
                <el-row :gutter="20">
                    <el-col :span="6">Comparison times:{{ Comparison_times }}</el-col>
                    <el-col :span="6">Swap times:{{ Swap_times }}</el-col>
                    <!-- <el-col :span="6">total time spent:{{ total_time_spent }}</el-col> -->
                    <!-- <el-button type="primary" @click="start_timer()" v-if="stop">start</el-button>
                    <el-button type="danger" @click="stop_timer()" v-if="start">stop</el-button> -->
                    <el-button type="primary" @click="reset_times()" style="margin-left:35% ;">reset</el-button>
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
                <el-form label-position="top" v-show="select_data_source">
                    <el-form-item label="Please select the data generation method">
                        <el-button type="primary" @click="select_random_generated()">randomly generated</el-button>
                        <el-button type="primary" @click="select_manmal_input()">manual input</el-button>
                        <el-button type="primary" @click="shufferArr()">shuffer array</el-button>
                    </el-form-item>
                </el-form>
                <el-form v-show="manmal_input">
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
                <el-form v-show="random_generated">
                    <el-form-item label="Please enter the size n of the array to be sorted">
                        <el-input placeholder="input n" v-model="n" style="width: 100px" />
                    </el-form-item>
                    <!-- <el-form-item label="The array containing n numbers is">
                        {{ array }}
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" @click="randomly_generated_array()">random generation</el-button>
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
            array: [
                {
                    value: 10,
                    itemStyle: {
                        color: '#3498DB'
                    }
                },
                {
                    value: 2,
                    itemStyle: {
                        color: '#3498DB'
                    }
                },
                {
                    value: 3,
                    itemStyle: {
                        color: '#3498DB'
                    }
                },
                {
                    value: 5,
                    itemStyle: {
                        color: '#3498DB'
                    }
                },
                {
                    value: 1,
                    itemStyle: {
                        color: '#3498DB'
                    }
                },
                {
                    value: 4,
                    itemStyle: {
                        color: '#3498DB'
                    }
                },
                {
                    value: 6,
                    itemStyle: {
                        color: '#3498DB'
                    }
                },
                {
                    value: 8,
                    itemStyle: {
                        color: '#3498DB'
                    }
                },
                {
                    value: 9,
                    itemStyle: {
                        color: '#3498DB'
                    }
                },
                {
                    value: 7,
                    itemStyle: {
                        color: '#3498DB'
                    }
                }
            ],
            manmal_input_string: "",
            Comparison_times: 0,
            Swap_times: 0,
            total_time_spent: 0,
            myChartStyle: { width: "100%", height: "100%" }, //图表样式
            HelpdialogVisible: false,
            Helpinfo: [`This is a software that implements sorting visualization.`,
                `You can choose to enter the data yourself or generate it randomly. You can select a sorting method on the left menu.`,
                `Click the reset button to reset various times.Click the shuffer array button to shuffer the array.`,
                `The following is the reference time complexity of each sort:`,
                `Insertion sort: Worst complexity: O(n ^ 2) Optimal complexity: O(n) Average complexity: O(n ^ 2)`,
                `Bubble sort: Worst complexity: O(n ^ 2) Optimal complexity: O(n) Average complexity: O(n ^ 2)`,
                `Selection sort: Worst complexity: O(n ^ 2) Optimal complexity: O(n ^ 2) Average complexity: O(n ^ 2)`,
                `Hill sort: unstable algorithm Optimal complexity: O(n) Optimal worst complexity : O(n(logn)^2)`,
                `Quick sort: unstable algorithm Optimal,average complexity : O(nlogn) worst complexity : O(n^2) `,
                `Heap sort: unstable algorithm Optimal, worst, average complexity : O(nlogn)`,
                `Merge sort: stable algorithm Optimal, worst, average complexity : O(nlogn)`,
                `Thank you for your support`
            ],
            QuestionFilled: QuestionFilled,
            selected_sorting_algorithm: null,
            myChart: null,
            timer: null,
            start: false,
            stop: true,
            option: {
                grid: {
                    show: true,
                },
                title: {
                    text: "Show Chart",
                },
                xAxis: {
                    type: "category",
                    data: [],
                    show: false,
                    // scale: false
                },
                yAxis: {
                    type: "value",
                },
                dataZoom: [
                    {
                        type: "slider",
                        xAxisIndex: 0,
                    },
                ],
                tooltip: {
                    trigger: "item",
                    formatter: function (arg) {
                        if (
                            arg.componentType === "markPoint" ||
                            arg.componentType === "markLine"
                        ) {
                            return (arg.data.name + ": " + arg.data.value).toString();
                        }
                        return arg.data.value;
                    },
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}, // 导出图片
                        // dataView: {}, // 数据视图
                        // restore: {}, // 重置
                        // dataZoom: {}, // 区域缩放
                        magicType: {
                            type: ["bar", "line"],
                        }, // 动态图表类型的切换
                    },
                },
                series: [
                    {
                        name: "元素数值",
                        type: "bar",
                        animation: false,
                        markPoint: {
                            data: [
                                {
                                    type: "max",
                                    name: "最大值",
                                    itemStyle: {
                                        color: "#909399",
                                    },
                                },
                                {
                                    type: "min",
                                    name: "最小值",
                                    itemStyle: {
                                        color: "#909399",
                                    },
                                    symbolRotate: 180,
                                    label: {
                                        padding: [23, 0, 0, 0],
                                    },
                                },
                            ],
                        },
                        markLine: {
                            data: [
                                {
                                    type: "average",
                                    name: "平均值",
                                    itemStyle: {
                                        color: "#909399",
                                    },
                                },
                            ],
                        },
                        label: {
                            show: true,
                            rotate: 30,
                            position: "inside",
                        },
                        //barWidth: 30,
                        data: [],
                        lineStyle: {
                            color: "#909399",
                        },
                    },
                ],
            }
        };
    },
    mounted() {
        this.initEcharts();
    },
    watch: {
        array: {
            handler(newv, oldv) {
                var newOption = {
                    xAxis: {
                        data: this.array,
                    },
                    series: [
                        {
                            data: this.array,
                        },
                    ],
                };
                this.myChart.setOption(newOption);
            },
            deep: true
        }
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
            this.option.xAxis.data = this.array;
            this.option.series[0].data = this.array;
            this.myChart = echarts.init(document.getElementById("mychart"));
            this.myChart.setOption(this.option, true);
            window.addEventListener("resize", () => {
                this.myChart.resize();
            });
        },
        // 交换数组两元素
        exchangeElem(index1, index2) {
            if (index1 == index2)
                return
            //深拷贝
            var newDataArr = this.array.concat([]);
            var tmp = newDataArr[index1]
            newDataArr[index1] = newDataArr[index2]
            newDataArr[index2] = tmp
            this.array = newDataArr
        },
        // 选中某元素
        selectElem(index, color = '#82E0AA') {
            var newDataArr = this.array.concat([])
            newDataArr[index].itemStyle.color = '#82E0AA'
            this.array = newDataArr
            console.log(this.array, newDataArr);
        },
        // 反选某元素
        deselectElem(index) {
            var newDataArr = this.array.concat([])
            newDataArr[index].itemStyle.color = '#3498DB'
            this.array = newDataArr
        },
        //深拷贝,不影响原值
        convertToNumList() {
            var numList = [];
            for (var i = 0; i < this.array.length; i++) {
                numList.push(this.array[i].value);
            }
            return numList;
        },
        randomly_generated_array() {
            if (isNaN(this.n) || (this.n % 1 != 0)) {
                ElNotification({
                    message: 'n should be a integer, please check and re-enter',
                    type: 'warning',
                });
                return;
            }
            var i;
            this.array.length = this.n;
            for (i = 0; i < this.n; i++) {
                this.array[i] = {
                    value: parseInt(Math.random() * this.n) + 1,
                    itemStyle: {
                        color: '#3498DB'
                    }
                };
            }
        },
        upload_data_manually() {
            let tmp_arr = this.manmal_input_string.split(' ');
            if (tmp_arr.length == this.n) {
                var suc = true;
                for (var i = 0; i < this.n; i++) {
                    if (isNaN(tmp_arr[i])) {
                        ElNotification({
                            message: 'Illegal input, please check and re-enter',
                            type: 'error',
                        });
                        suc = false
                        break
                    }
                }
                if (suc) {
                    this.array.length = this.n;
                    for (var i = 0; i < this.n; i++) {
                        this.array[i] = {
                            value: Number(tmp_arr[i]),
                            itemStyle: {
                                color: '#3498DB'
                            }
                        };
                    }
                }
            }
            else {
                ElNotification({
                    message: 'Please enter n number',
                    type: 'error',
                })
            }
        },
        shufferArr() {
            this.array.sort(() => (0.5 - Math.random())) //正负各一半
        },
        reset_times() {
            this.Comparison_times = 0;
            this.total_time_spent = 0;
            this.Swap_times = 0;
        },
        swap(arr, i, j) {
            if (i == j)
                return;
            var tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        },
        insertion_sort() {
            var newArr = this.convertToNumList()
            for (var i = 1; i < this.n; i++) {
                this.Comparison_times++;
                if (newArr[i] < newArr[i - 1]) {
                    var tmp = newArr[i];
                    newArr[i] = newArr[i - 1];
                    ((i) => {
                        setTimeout(() => {
                            //this.selectElem(i);
                            this.exchangeElem(i, i - 1);
                            //this.deselectElem(i - 1);
                        }, 50);
                    })(i);
                    this.Swap_times++;
                    var j;
                    for (j = i - 2; j >= 0 && newArr[j] > tmp; j--) {
                        newArr[j + 1] = newArr[j];
                        ((j) => {
                            setTimeout(() => {
                                //this.selectElem(j);
                                this.exchangeElem(j, j + 1);
                                //this.deselectElem(j + 1);
                            }, 50);
                        })(j);
                        this.Comparison_times++;
                        this.Swap_times++;
                    }
                    newArr[j + 1] = tmp;
                }
            }
        },
        bubble_sort() {
            var newArr = this.convertToNumList()
            var i, j;
            for (i = 1; i < this.n; i++) {
                for (j = 0; j < this.n - i; j++) {
                    if (newArr[j] > newArr[j + 1]) {
                        this.Swap_times++;
                        this.swap(newArr, j, j + 1);
                        //立即执行的匿名函数
                        ((j) => {
                            setTimeout(() => {
                                //this.selectElem(j);
                                this.exchangeElem(j, j + 1);
                                //this.deselectElem(j + 1);
                            }, 50);
                        })(j);
                    }
                    this.Comparison_times++;
                }
            }
        },
        select_sort() {
            var newArr = this.convertToNumList()
            for (var i = 0; i < this.n - 1; i++) {
                var pos = i;
                for (var j = i + 1; j < this.n; j++) {
                    this.Comparison_times++;
                    if (newArr[j] < newArr[pos])
                        pos = j;
                }
                this.swap(newArr, pos, i);
                ((pos, i) => {
                    setTimeout(() => {
                        this.exchangeElem(pos, i);
                    }, 50);
                })(pos, i);
                this.Swap_times++;
            }
        },
        hill_sort() {
            var newArr = this.convertToNumList()
            for (var gap = this.n / 2; gap >= 1; gap = Math.floor(gap / 2)) {
                for (var i = gap; i < this.n; i += gap) {
                    this.Comparison_times++;
                    if (newArr[i] < newArr[i - gap]) {
                        let tmp = newArr[i];
                        newArr[i] = newArr[i - gap];
                        ((i, gap) => {
                            setTimeout(() => {
                                this.exchangeElem(i, i - gap);
                            }, 50);
                        })(i, gap);
                        var j;
                        for (j = i - gap * 2; j >= 0 && newArr[j] > tmp; j -= gap) {
                            newArr[j + gap] = newArr[j];
                            ((j, gap) => {
                                setTimeout(() => {
                                    this.exchangeElem(j, j + gap);
                                }, 50);
                            })(j, gap);
                            this.Comparison_times++;
                            this.Swap_times++;
                        }
                        newArr[j + gap] = tmp;
                    }
                }
            }
        },
        quick_sort(newArr, l, r) {
            if (l >= r)
                return;
            var tmp = newArr[l];
            var i = l, j = r;
            while (i != j) {
                while (newArr[j] >= tmp && j > i) {
                    this.Comparison_times++;
                    j--;
                }
                while (newArr[i] <= tmp && j > i) {
                    this.Comparison_times++;
                    i++;
                }
                if (j > i) {
                    this.swap(newArr, i, j);
                    ((i, j) => {
                        setTimeout(() => {
                            this.exchangeElem(i, j);
                        }, 50);
                    })(i, j);
                    this.Swap_times++;
                }
            }
            newArr[l] = newArr[i];
            newArr[i] = tmp;
            this.Swap_times++;
            ((i, l) => {
                setTimeout(() => {
                    this.exchangeElem(i, l);
                }, 50);
            })(i, l);
            this.quick_sort(newArr, l, i - 1);
            this.quick_sort(newArr, i + 1, r);
        },
        heapadj(newArr, sta, len) {
            let fa = sta;
            let child = fa * 2 + 1; //0为根需要+1
            while (child < len) {
                this.Comparison_times += 2;
                if (newArr[child + 1] > newArr[child] && child + 1 < len)
                    child++;
                if (newArr[fa] > newArr[child])
                    return;
                else {
                    this.swap(newArr, fa, child);
                    ((fa, child) => {
                        setTimeout(() => {
                            this.exchangeElem(fa, child);
                        }, 50);
                    })(fa, child);
                    this.Swap_times++;
                    fa = child;
                    child = child * 2 + 1;
                }
            }
        },
        heap_sort() {
            var newArr = this.convertToNumList()
            for (var i = Math.floor(this.n / 2); i >= 0; i--)
                this.heapadj(newArr, i, this.n);
            for (var i = this.n - 1; i > 0; i--) {
                this.swap(newArr, 0, i);
                ((i) => {
                    setTimeout(() => {
                        this.exchangeElem(0, i);
                    }, 50);
                })(i);
                this.Swap_times++;
                this.heapadj(newArr, 0, i);
            }
        },
        //移动元素，只有归并排序用得到
        moveElem(from, to) {
            if (from == to)
                return
            //深拷贝
            var newArr = this.array.concat([])
            var tmp = newArr[from]
            if (from < to) {
                for (var i = from; i < to; i++)
                    newArr[i] = newArr[i + 1]
                newArr[to] = tmp
            }
            else {
                for (var i = from; i > to; i--)
                    newArr[i] = newArr[i - 1]
                newArr[to] = tmp
            }
            this.array = newArr
        },
        merge_sort(newArr, l, r) {
            var tmp = new Array(r - l + 1);
            if (l == r)
                return;
            var mid = Math.floor((l + r) / 2);
            var i = l, j = mid + 1, pos = 0;
            this.merge_sort(newArr, l, mid);
            this.merge_sort(newArr, mid + 1, r);
            while (i <= mid && j <= r) {
                this.Comparison_times++;
                if (newArr[i] > newArr[j]) {
                    ((pos, j, l) => {
                        setTimeout(() => {
                            this.moveElem(j, pos + l);
                        }, 50);
                    })(pos, j, l);
                    tmp[pos++] = newArr[j++];
                    this.Swap_times++;
                }
                else
                    tmp[pos++] = newArr[i++];
            }
            while (i <= mid)
                tmp[pos++] = newArr[i++];
            while (j <= r)
                tmp[pos++] = newArr[j++];
            for (var k = l; k <= r; k++)
                newArr[k] = tmp[k - l];
        },
    }
};
</script>


