<template>
    <div :class="$style.block">
        <Loader v-if="isLoading" />
        <div :class="$style.actions" v-if="actions">
            <div :class="$style.left">
                <slot name="actionsLeft" />
            </div>
            <div :class="$style.right">
                <slot name="actionsRight" />
            </div>
        </div>
        <div :class="$style.table">
            <Table ref="selection" :row-class-name="rowClassName" :stripe="!noStripe" :no-data-text="noDataText" :highlight-row="highlightRow"	 @on-selection-change="selectHandler" @on-sort-change="sortHandler" :data="data" :columns="columns" @on-current-change="singleSelectHandler" />
        </div>
        <div :class="$style.pagination" v-if="pagination">
            <template v-if="showPrevPage">
                <div :class="[$style.paginationButton, $style.paginationButtonFirst].join(' ')" role="button" @click="firstPage" >
                    <Icon type="ios-arrow-back"/>
                    <Icon type="ios-arrow-back"/>
                </div>
                <div :class="$style.paginationButton" role="button" @click="previousPage">
                    <Icon type="ios-arrow-back"/>
                </div>
            </template>
            <div :class="$style.paginationText">
                <!-- {{ paginationText }} -->
                <a @click.self="toggleSelection" v-if="pagination && pagination.total > 10">{{startIndex}}</a> 
                <span v-else>{{startIndex}}</span>
                {{ ` - ${endIndex} of ${pagination.total}` }}
            </div>
            <template v-if="showNextPage">
                <div :class="$style.paginationButton" role="button" @click="nextPage">
                    <Icon type="ios-arrow-forward"/>
                </div>
                <div :class="[$style.paginationButton, $style.paginationButtonFirst].join(' ')" role="button" @click="lastPage">
                    <Icon type="ios-arrow-forward"/>
                    <Icon type="ios-arrow-forward"/>
                </div>
            </template>
        </div>
        <div :class="$style.secondTableBottomRow">
            <div  :class="$style.flex">
                <div v-if="legends.length > 0 && pagination.total > 0">
                    <div v-for="(legend,index) in legends" :key="index" :class="$style.flex">
                        <div :class="$style.legendColorBox" :style="{background:legend.color}"></div> <strong>* {{legend.text}}</strong>
                    </div>
                </div>
            </div>
            <template v-if="pagination"  >
                <FormSelect v-if="enableSelection" :width="80" label="Go to Page" v-model="selectedIndex" placeholder="" :clearable="false" :items="pageArray" item-name="value" item-value="value" />
            </template>
        </div>
    </div>
</template>

<script>

    import { locale, Table } from 'view-design';
    import lang from 'view-design/dist/locale/en-US';

    locale(lang);
    export default {
        name: "DataTable",
        components: {
            Table
        },
        computed: {
            showNextPage() {
                const { total } = this.pagination;
                return this.endIndex < +total;
            },
            showPrevPage() {
                const { page } = this.pagination;
                return page > 1;
            },
            startIndex() {
                const { perPage, page, total } = this.pagination;
                return +total > 0 ? perPage * (page - 1) + 1 : 0;
            },
            endIndex() {
                const { perPage, total, page } = this.pagination;
                const endIndex = perPage * page;
                return endIndex < +total ? endIndex : +total;
            },
            paginationText() {
                const { total } = this.pagination;
                return `${this.startIndex} - ${this.endIndex} of ${total}`
            },
            pageArray() {
                const { perPage, total, page } = this.pagination;
                const totalPage =  Math.ceil(total / perPage);
                const pageArr = []
                for (var i = 1 ; i <= totalPage ; i++) {
                    pageArr.push({value: i})
                }
                return pageArr
            }
        },
        props: {
            columns: Array,
            data: Array,
            actions: Boolean,
            pagination: Object,
            noDataText: String,
            isLoading: Boolean,
            rowClassName: [Function,String,Object,Array],
            highlightRow: {
                type: Boolean,
                default: false
            },
            noStripe: {
                type: Boolean,
                default: false,
            },
            selectAll: {type:Boolean,default: false},
            legends: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                selectedIndex: null,
                enableSelection: false,
            }
        },
        watch: {
            selectedIndex(val) {
                this.$emit('on-page-change', val);
            },
            selectAll(val){
                var self = this;
                setTimeout(()=>{
                    if(self.selectAll === true){
                        self.$refs.selection.selectAll(val)
                    }

                },100)
            }
        },
        methods: {
            toggleSelection() {
                this.enableSelection = !this.enableSelection
            },
            firstPage() {
                this.$emit('on-page-change', 1);
            },
            lastPage() {
                const { perPage, total } = this.pagination;
                this.$emit('on-page-change', Math.ceil(total / perPage));
            },
            previousPage() {
                this.$emit('on-page-change', this.pagination.page - 1);
            },
            nextPage() {
                this.$emit('on-page-change', this.pagination.page + 1);
            },
            selectHandler(data) {
                this.$emit('on-selection-change', data)
            },
            sortHandler(data) {
                this.$emit('on-sort-change', data)
            },
            singleSelectHandler(data) {
                this.$emit('on-single-selection',data)
            }
        }
    }
</script>

<style lang="scss" module>
    .block {
        position: relative;
    }

    .actions {
        display: flex;
        padding: 2px 0;
        border-top: 1px solid #ddd
    }
    .right {
        margin-left: auto;

        > * {
            margin-left: 5px;
            &:before {
                position: absolute;
                left: -3px;
                content: '';
                width: 1px;
                display: block;
                background-color: #ddd;
                top: 0;
                bottom: 0;
            }
            &:first-child {
                &:before {
                    display: none;
                }
            }
        }
    }
    .left {
        > * {
            margin-right: 5px;
            &:before {
                position: absolute;
                right: -3px;
                content: '';
                width: 1px;
                display: block;
                background-color: #ddd;
                top: 0;
                bottom: 0;
            }
            &:last-child {
                &:before {
                    display: none;
                }
            }
        }
    }

    .pagination {
        margin: 10px 0 0;
        text-align: right;
        display: flex;
        justify-content: flex-end;
        line-height: 26px;
    }

    .paginationText {
        margin: 0 20px;
    }

    .paginationButton {
        cursor: pointer;
        width: 26px;
        text-align: center;
        transition: background-color .2s ease-in-out, color .2s ease-in-out, box-shadow 200ms ease
    }

    .paginationButtonFirst {
        :global {
            .ivu-icon {
                margin: 0 -8px;
            }
        }
    }

    .paginationButton:hover {
        background: #57a3f3;
        color: #fff;

        &:hover {
            box-shadow: 0 5px 11px 0 rgba(0, 0, 0, .18), 0 4px 15px 0 rgba(0, 0, 0, .15);
        }
    }
    .table {
        :global {
            .ivu-table td{
                .ivu-table-cell {
                    word-break: break-all!important;
                }
            }
        }
    }
    .flex{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }
    .secondTableBottomRow {
        margin: 10px 0 0;
        display: flex;
        justify-content: space-between;
        line-height: 26px;
        width: 100%;
    }
    // .legendStyle {
    //     display: flex;
    //     align-items: center;
    //     flex-wrap: wrap;
    //     // min-width: 100px;
    //     // min-height: 20px;
    // }
    .legendColorBox {
        width: 15px;
        height: 15px;
        margin-right: 15px;
    }
</style>
