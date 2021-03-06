import BScroll from "@better-scroll/core";
import PullDown from '@better-scroll/pull-down';
import Pullup from '@better-scroll/pull-up';
import ScrollBar from '@better-scroll/scroll-bar';
import NestedScroll from '@better-scroll/nested-scroll';


BScroll.use(PullDown);
BScroll.use(Pullup);
BScroll.use(ScrollBar);
BScroll.use(NestedScroll);
export default {
  name: "VueScrollRefreshLoad",
  props: {
    loadingText: { // 加载中提示文字
      type: String,
      default: '加载中...'
    },
    beforePullDownText: { // 下拉刷新前显示的文字
      type: String,
      default: '下拉即可刷新'
    },
    pullDownRefreshSuccessText: { // 下拉刷新成功获取数据后的文字
      type: String,
      default: '数据刷新成功！'
    },
    pullDownRefreshErrorText: { // 下拉刷新获取数据失败后的文字
      type: String,
      default: '数据加载失败！'
    },
    pullUpFetchDataErrorText: { // 上拉加载数据请求失败时显示的文字
      type: String,
      default: '请求失败，点击重新加载'
    },
    pullUpFetchDataNoMoreText: { // 上拉加载数据无更多数据时显示的文字
      type: String,
      default: '已经到底部，没有更多内容了'
    },
    pullDownConfig: { // 下拉刷新配置
      type: [Boolean, Object],
      default(){
        return {
          threshold: 60
        };
      }
    },
    pullUpConfig: { // 上拉加载配置
      type: [Boolean, Object],
      default: true
    },
    betterScrollConfig: { // better-scroll配置
      type: Object,
      default(){
        return {};
      }
    },
    scrollbar: { // 是否开启scrollbar
      type: Boolean,
      default: true
    },
    height: { // 容器高度，如果容器高度为0则默认取父级容器的高度
      type: Number,
      default: 0
    },
    stopTime: { // 数据刷新后better-scroll弹起停留时间
      type: Number,
      default: 600
    },
    pullUpLoadError: { // 上拉加载数据是否出错
      type: Boolean,
      default: false
    },
    pullUpLoadNoMoreData: { // 上拉加载已经没有更多数据了
      type: Boolean,
      default: false
    },
    click: { // 是否支持click事件，与better-scroll配置click作用一致
      type: Boolean,
      default: true
    },
    autoInit: { // 是否自动初始化 better-scroll
      type: Boolean,
      default: true
    },
    disabled: { // 是否禁用滚动
      type: Boolean,
      default: false
    },
    dataLoading: { // 数据是否正在加载中，每当dataLoading值改变better-scroll都会自动刷新
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      // 下拉刷新相关数据
      pulldownData: {
        loading: false,
        refreshDataSuccess: false,
        refreshDataError: false,
        beforePullDown: true
      },
      // 上拉加载相关数据
      pullupData: {
        loading: false
      }
    };
  },
  methods: {
    /**
     * 初始化滚动条
     * @param cb 初始化完成后的回调函数
     * @returns {BScroll | BScroll}
     */
    initScroll(cb){
      if(this.bScroll){
        console.error('better-scroll已经初始化，请勿重复初始化！');
        return;
      }
      if(this.height && this.height > 0){
        this.$refs.vueScrollRefreshLoad.style.height = this.height + 'px';
      }
      this.bScroll = new BScroll(this.$refs.bsWrapper, {
        scrollY: true,
        pullDownRefresh: this.pullDownConfig,
        scrollbar: this.scrollbar,
        pullUpLoad: this.pullUpConfig,
        click: this.click,
        ...this.betterScrollConfig
      });
      console.log('BS', this.bScroll)
      if(this.pullDownConfig){
        this.bScroll.on('pullingDown', this._pullingDownHandler);
      }
      if(this.pullUpConfig){
        this.bScroll.on('pullingUp', this._pullingUpHandler);
      }
      this.$emit('onInit', this.bScroll);
      (typeof cb === 'function') && cb(this.bScroll);
      return this.bScroll;
    },
    // 刷新better-scroll
    refresh(){
      if(this.bScroll){
        let timer = setTimeout(() => {
          clearTimeout(timer);
          this.bScroll.refresh();
        }, 100);
      }else{
        console.error('better-scroll未初始化！');
      }
    },
    // 启用better scroll
    enable(){
      if(this.bScroll){
        this.bScroll.enable();
      }
    },
    // 禁用better scroll
    disable(){
      if(this.bScroll){
        this.bScroll.disable();
      }
    },
    // 销毁better scroll
    destroy(){
      if(this.bScroll){
        this.bScroll.destroy();
      }
    },
    /**
     * 滚动到指定的位置
     * @param x {Number} x 横轴坐标（单位 px）
     * @param y {Number} y 纵轴坐标（单位 px）
     * @param time {Number} time 滚动动画执行的时长（单位 ms）
     * @param easing {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
     */
    scrollTo(x, y, time, easing){
      if(this.bScroll){
        this.bScroll.scrollTo(x, y, time, easing);
      }
    },
    /**
     * 相对于当前位置偏移滚动 x,y 的距离。
     * @param x {Number} x 横轴坐标（单位 px）
     * @param y {Number} y 纵轴坐标（单位 px）
     * @param time {Number} time 滚动动画执行的时长（单位 ms）
     * @param easing {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
     */
    scrollBy(x, y, time, easing){
      if(this.bScroll){
        this.bScroll.scrollBy(x, y, time, easing);
      }
    },
    /**
     * 相对于当前位置偏移滚动 x,y 的距离。
     * @param el {DOM | String} el 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象。
     * @param time {Number} time 滚动动画执行的时长（单位 ms）
     * @param offsetX {Number | Boolean} offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
     * @param offsetY {Number | Boolean} offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
     * @param easing {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
     */
    scrollToElement(el, time, offsetX, offsetY, easing){
      if(this.bScroll){
        this.bScroll.scrollToElement(el, time, offsetX, offsetY, easing);
      }
    },
    // 自动执行下拉刷新
    autoPullDownRefresh(){
      if(this.bScroll){
        this.bScroll.autoPullDownRefresh();
      }
    },
    // 处理下拉刷新
    _pullingDownHandler() {
      this.pulldownData.beforePullDown = false;
      this.pulldownData.loading = true;

      this.$emit('refresh', this.finishPullDown);
    },
    // 结束下拉刷新
    async finishPullDown(isLoadDataSuccess = true) {
      this.pulldownData.loading = false;
      // 先显示 数据加载成功或数据加载失败提示，过一会后再回弹(即让提示消失)
      this.pulldownData.refreshDataSuccess = isLoadDataSuccess;
      this.pulldownData.refreshDataError = !isLoadDataSuccess;
      await new Promise(resolve => {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          // 结束下拉刷新，必须调用
          this.bScroll.finishPullDown();
          resolve();
        }, this.stopTime);
      });
      let timer = setTimeout(() => {
        clearTimeout(timer);
        this.pulldownData.refreshDataSuccess = false;
        this.pulldownData.refreshDataError = false;
        this.pulldownData.beforePullDown = true;
        this.bScroll.refresh();
      }, this.stopTime + 200);
    },
    // 处理上拉加载
    _pullingUpHandler(){
      if(this.pullUpLoadError || this.pullUpLoadNoMoreData){
        // 当上拉加载已经没数据时，需等用户上拉操作完成滚动条回弹后再结束上拉加载
        let timer = setTimeout(() => {
          clearTimeout(timer);
          this.pullupData.loading = false;
          this.bScroll.finishPullUp();
          this.refresh();
        }, this.bScroll.options.bounceTime);
        console.log('上拉加载被阻止了')
        //this.finishPullUp();
        return;
      }
      console.log('处理上拉加载')
      this.pullupData.loading = true;
      this.$nextTick(() => {
        this.bScroll.refresh();
        this.$emit('pullup', this.finishPullUp);
      });
    },
    // 结束上拉加载
    finishPullUp(){
      this.pullupData.loading = false;
      // 结束上拉加载，必须调用
      this.bScroll.finishPullUp();
      this.refresh();
    },
    // 点击按钮重新加载
    rePullupLoad(){
      this.$emit('rePullUp', this.finishPullUp);
      this.pullupData.loading = true;
    }
  },
  watch: {
    height(height){
      this.$refs.vueScrollRefreshLoad.style.height = height + 'px';
      this.refresh();
    },
    pullUpLoadNoMoreData(newVal, oldVal){
      // 如果之前已经没有更多数据，后面用户刷新数据了，则需要将 pullupData.loading 设置为 true
      if(!newVal && oldVal){
        this.pullupData.loading = true;
        this.refresh();
      }
    },
    disabled(newVal){
      if(newVal){
        this.disable();
      }else{
        this.enable();
      }
    },
    dataLoading(){
      this.refresh();
    },
    betterScrollConfig: {
      deep: true,
      handler(){
        this.refresh();
      }
    }
  },
  created() {
    this.bScroll = null;
  },
  mounted() {
    if(this.autoInit){
      this.initScroll(() => {
        if(this.disabled){
          this.disable();
        }
      });
    }
  },
  beforeDestroy(){
    this.destroy();
  }
};
